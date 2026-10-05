"""Generate the free, offline Japanese sample. See ../audio/README.md."""
from pathlib import Path
import hashlib
import json
import subprocess
import tempfile

import numpy as np
import urllib.request
import urllib.parse
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
spec = json.loads((ROOT / 'audio/sample-01.json').read_text())
out = ROOT / 'public/audio'
out.mkdir(parents=True, exist_ok=True)
pronunciations = {'SAA': 'エスエーエー', 'EC2': 'イーシーツー', 'S3': 'エススリー', 'IAM': 'アイアム', 'AWS': 'エーダブリューエス'}
segments = []
with tempfile.TemporaryDirectory(prefix='saa-audio-') as directory:
    work = Path(directory)
    for i, segment in enumerate(spec['segments']):
        spoken = segment['text']
        for term, reading in pronunciations.items():
            spoken = spoken.replace(term, reading)
        base = 'http://127.0.0.1:50021/'
        request = urllib.request.Request(base + 'audio_query?' + urllib.parse.urlencode({'speaker': 9, 'text': spoken}), method='POST')
        query = json.load(urllib.request.urlopen(request, timeout=60))
        query.update(speedScale=0.95, intonationScale=0.9, pitchScale=0, outputSamplingRate=44100)
        request = urllib.request.Request(base + 'synthesis?speaker=9', data=json.dumps(query).encode(), headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(request, timeout=240) as response:
            (work / f'raw-{i}.wav').write_bytes(response.read())
        wave, sample_rate = sf.read(work / f'raw-{i}.wav')
        assert sample_rate == 44100 and np.isfinite(wave).all() and np.max(np.abs(wave)) > 0
        segments.append({**segment, 'spoken': spoken, 'raw_seconds': len(wave) / sample_rate})
        print(f"Synthesized {i + 1}/{len(spec['segments'])}: {len(wave) / sample_rate:.1f}s", flush=True)
    pauses = sum(s['pause_after'] for s in segments)
    factor = sum(s['raw_seconds'] for s in segments) / (spec['target_seconds'] - pauses)
    if not 0.80 <= factor <= 1.25:
        raise ValueError(f'Edit script length before synthesis: required tempo factor {factor:.3f}')
    combined = []
    cursor = 0.0
    timeline = []
    for i, segment in enumerate(segments):
        subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', str(work / f'raw-{i}.wav'), '-af', f'atempo={factor:.8f}', str(work / f'paced-{i}.wav')], check=True)
        wave, sample_rate = sf.read(work / f'paced-{i}.wav')
        timeline.append({'title': segment['title'], 'start_seconds': round(cursor, 3), 'text': segment['text'], 'spoken': segment['spoken'], 'pause_after': segment['pause_after']})
        combined.extend([wave, np.zeros(round(sample_rate * segment['pause_after']))])
        cursor += len(wave) / sample_rate + segment['pause_after']
    sf.write(work / 'combined.wav', np.concatenate(combined), sample_rate, subtype='PCM_16')
    destination = out / 'photo-studio-ritsu-5min.mp3'
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', str(work / 'combined.wav'), '-af', 'loudnorm=I=-18:TP=-2:LRA=7', '-ar', '44100', '-ac', '1', '-codec:a', 'libmp3lame', '-b:a', '128k', '-metadata', f"title={spec['title']}", '-metadata', 'artist=SAAへの道 / VOICEVOX:波音リツ', '-metadata', 'comment=VOICEVOX:波音リツ / ノーマル; tempo and loudness adjusted.', str(destination)], check=True)
    probe = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_format', '-show_streams', '-of', 'json', str(destination)]))
    duration = float(probe['format']['duration'])
    assert 295 <= duration <= 305, duration
    metadata = {'title': spec['title'], 'duration_seconds': duration, 'tempo_factor': factor, 'voice': 'VOICEVOX:波音リツ / ノーマル / Engine 0.25.2', 'sha256': hashlib.sha256(destination.read_bytes()).hexdigest(), 'synthesis_settings': {'speaker': 9, 'speedScale': 0.95, 'intonationScale': 0.9, 'pitchScale': 0}, 'segments': timeline}
    (out / 'sample-01.json').write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + '\n')
    transcript = '# ' + spec['title'] + '\n\n合成音声による約5分の学習サンプル。音声と同じ内容の台本です。\n\n'
    for segment in timeline:
        second = round(segment['start_seconds'])
        transcript += f"## {second // 60:02}:{second % 60:02} {segment['title']}\n\n{segment['text']}\n\n"
        if segment['pause_after'] >= 7:
            transcript += '（考える時間：7秒）\n\n'
    (ROOT / 'audio/TRANSCRIPT.md').write_text(transcript)
    print(json.dumps({k: v for k, v in metadata.items() if k != 'segments'}, ensure_ascii=False, indent=2))
