"""Package presentation sources only; never include personal saves or dist."""
import hashlib,json,pathlib,subprocess,zipfile
root=pathlib.Path(__file__).resolve().parents[2]
base=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()
files=list((root/'materials/public/tower').rglob('*'))
files += [root/x for x in ['materials/src/QuestIcon.tsx','materials/src/DesignQuest.tsx','materials/src/game.css','materials/scripts/icons-browser-check.mjs','materials/scripts/icons-audit.mjs','materials/scripts/icon-fixtures.mjs','materials/scripts/effects-browser-check.mjs','materials/scripts/junk-browser-check.mjs','materials/scripts/options-browser-check.mjs','materials/scripts/build-tower.mjs','materials/scripts/verify-publication.py','materials/scripts/package-icons.py','materials/docs/ICON_REPRODUCTION.md','.github/workflows/deploy.yml']]
files=sorted(p for p in files if p.is_file())
manifest={'base_commit':base,'format_version':1,'scope':'SVG presentation adapted to current game; original supplied kit unavailable','files':[{'path':p.relative_to(root).as_posix(),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}for p in files]}
out=root/'materials/output/icon-reproduction';out.mkdir(parents=True,exist_ok=True)
(out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
with zipfile.ZipFile(out/'icon-reproduction-kit.zip','w',zipfile.ZIP_DEFLATED)as z:
 z.writestr('manifest.json',json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
 for p in files:z.write(p,p.relative_to(root).as_posix())
with zipfile.ZipFile(out/'icon-reproduction-kit.zip')as z:
 assert z.testzip()is None
 for entry in manifest['files']:assert hashlib.sha256(z.read(entry['path'])).hexdigest()==entry['sha256']
print(f"Kit: {len(files)} files; CRC/SHA256 verified; base {base}")
