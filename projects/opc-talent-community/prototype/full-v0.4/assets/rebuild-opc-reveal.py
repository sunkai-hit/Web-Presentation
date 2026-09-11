from pathlib import Path
import base64

BASE = Path(__file__).resolve().parent
source = BASE / "opc-reveal-small.base64.txt"
target = BASE / "opc-reveal.jpg"

data = base64.b64decode(source.read_text(encoding="utf-8").strip())
target.write_bytes(data)
print(f"rebuilt: {target} ({len(data)} bytes)")
