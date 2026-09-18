# 3D / BIM Asset Credits

## Campus LOD assets

The campus overview continues to use selected building and vegetation GLB assets derived from **Quaternius Downtown City MegaKit**.

- Author: Quaternius
- License: CC0 1.0 Universal
- Used for: campus overview buildings and vegetation
- Local path: `assets/models/`

## Detailed BIM drilldown model

The detailed building drilldown uses the **Schependomlaan** open BIM dataset as a representative LOD4/BIM sample model.

- Original project/model: Schependomlaan, Nijmegen
- Original model author: ROOT bv, for Hendriks Bouw en Ontwikkeling
- Dataset license: **Creative Commons Attribution 4.0 International (CC BY 4.0)**
- Original dataset: openBIMstandards / DataSetSchependomlaan
- Local license copy: `assets/bim/LICENSE-Schependomlaan.md`
- glTF conversion source used by this prototype: xeokit/examples, `assets/models/gltf/Schependomlaan/glTF-Embedded/Schependomlaan.gltf`
- BIM metadata source: xeokit/examples, `Schependomlaan.json`

The detailed BIM model is used only as a representative interaction asset. In a real IBMS project it should be replaced with the customer's IFC/Revit/BIM deliverable while keeping the same floor, component and system interaction layer.

## Three.js

- Runtime: Three.js 0.180.0
- License: MIT
- Local path: `vendor/three/`


## v0.5.0 performance conversion

The detailed Schependomlaan model is converted from embedded JSON glTF to binary GLB using CesiumGS **gltf-pipeline**.

- Source embedded glTF: 23,075,654 bytes
- Binary GLB: 14,055,184 bytes
- Reduction: approximately 39%
- Draco compression is intentionally not applied in this prototype so IFC node identity and a decoder-free local runtime are preserved.
- Runtime also uses BIM-only direct rendering (no Bloom pass), lazy professional-system construction and cached material variants.
