$ErrorActionPreference = "Stop"
$base = "https://raw.githubusercontent.com/anshaneja5/skyline-run/0c41526d8d4130c37c15e219c2c3737fa8cb4ad8/public/assets/models"
$target = Join-Path $PSScriptRoot "assets\models"
New-Item -ItemType Directory -Force -Path $target | Out-Null
$files = @(
  "b_large.glb","b_medium.glb","b_small.glb",
  "tree1.glb","tree2.glb","tree3.glb","bush.glb",
  "LICENSE-quaternius.txt"
)
foreach ($f in $files) {
  Write-Host "Downloading $f ..."
  Invoke-WebRequest -Uri "$base/$f" -OutFile (Join-Path $target $f)
}
Write-Host ""
Write-Host "IBMS local model assets downloaded to: $target"
