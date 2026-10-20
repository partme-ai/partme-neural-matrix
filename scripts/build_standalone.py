"""Build one-file V3 with both scores and zero external dependencies."""
from pathlib import Path
import base64
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'src';text=(SRC/'index.html').read_text()
for file,marker in [('styles.css','<link rel="stylesheet" href="./styles.css" />'),('app.js','<script src="./app.js"></script>'),('audio.js','<script src="./audio.js"></script>')]:
    content=(SRC/file).read_text()
    repl=('<style>\n'+content+'\n</style>') if file.endswith('css') else ('<script>\n'+content+'\n</script>')
    assert marker in text,file
    text=text.replace(marker,repl)
for file in ('partme-ambient-40s.mp3','partme-pulse-40s.mp3'):
    src='./assets/'+file
    assert src in text
    text=text.replace(src,'data:audio/mpeg;base64,'+base64.b64encode((SRC/'assets'/file).read_bytes()).decode())
assert text.count('data:audio/mpeg;base64,')==2
p=ROOT/'partme-neural-matrix-v3.html';p.write_text(text)
print('BUILT',p,p.stat().st_size,'bytes')
