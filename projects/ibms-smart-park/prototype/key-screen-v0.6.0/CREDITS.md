# 3D / BIM Asset Credits — IBMS v0.6.0

## Campus LOD

Campus overview continues to use selected building and vegetation GLB assets derived from **Quaternius Downtown City MegaKit**.

- Author: Quaternius
- License: CC0 1.0 Universal
- Local path: `assets/models/`

## Detailed BIM

The detailed building drilldown uses the **Schependomlaan** open BIM dataset as a representative BIM / LOD4 model.

- Original project/model: Schependomlaan, Nijmegen
- Original author: ROOT bv, for Hendriks Bouw en Ontwikkeling
- Dataset license: Creative Commons Attribution 4.0 International (CC BY 4.0)
- Local license: `assets/bim/LICENSE-Schependomlaan.md`
- XKT conversion source: xeokit/examples
- Local BIM file: `assets/bim/Schependomlaan.ifc.xkt`

The model is a representative interaction asset. A real IBMS project should replace it with the customer's IFC/Revit/BIM deliverable converted to XKT or another BIM-optimized runtime format.

## BIM runtime

Detailed BIM rendering uses **xeokit**.

- Engine: xeokit SDK
- License: AGPL-3.0 / commercial licensing options apply to xeokit distribution and deployment; review project licensing before production deployment.
- Local runtime: `vendor/xeokit/xeokit-sdk.min.es.js`
- Local XKT model size: 1,595,503 bytes
- Previous v0.5.0 binary GLB size: 14,055,184 bytes

The XKT asset is roughly 89% smaller than the v0.5.0 binary GLB and is rendered using xeokit's BIM-oriented data texture path.

## Three.js

Campus LOD continues to use Three.js 0.180.0.

- License: MIT
- Local path: `vendor/three/`
