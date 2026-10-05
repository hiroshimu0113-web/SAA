from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import hashlib

root = Path(__file__).resolve().parent.parent
out = root / 'deliverables'
out.mkdir(exist_ok=True)

with ZipFile(out / 'SAA-starter-app.zip', 'w', ZIP_DEFLATED) as archive:
    for path in sorted((root / 'dist').rglob('*')):
        if path.is_file():
            archive.write(path, path.relative_to(root))
    for name in ['scripts/serve.mjs', 'Start-Learning.cmd', 'deliverables/使い方.md']:
        archive.write(root / name, name)

with ZipFile(out / 'SAA-project-source.zip', 'w', ZIP_DEFLATED) as archive:
    for dirname in ['src', 'public', 'scripts', 'tests', 'docs', '.github']:
        for path in sorted((root / dirname).rglob('*')):
            if path.is_file():
                archive.write(path, path.relative_to(root))
    for name in ['package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', '.npmrc', '.gitignore', 'tsconfig.json', 'vite.config.ts', 'index.html', 'README.md', 'Start-Learning.cmd', 'SAAへの道.md', 'deliverables/使い方.md']:
        archive.write(root / name, name)

lines = []
for name in ['SAA-starter.epub', 'SAA-starter.html', 'SAA-starter-app.zip', 'SAA-project-source.zip']:
    path = out / name
    lines.append(f'{hashlib.sha256(path.read_bytes()).hexdigest()}  {name}')
    print(f'{name}: {path.stat().st_size:,} bytes')
    if path.suffix == '.zip':
        with ZipFile(path) as archive:
            assert archive.testzip() is None
(out / 'SHA256SUMS.txt').write_text('\n'.join(lines) + '\n', encoding='utf-8')
