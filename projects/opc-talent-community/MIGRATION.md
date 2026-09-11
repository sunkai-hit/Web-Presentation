# OPC Project Migration

The OPC presentation now has a formal project-local workspace under `projects/opc-talent-community/`.

## Preserved historical trees

The historical `spec/`, `design/`, `prototype/`, `qa/`, `release/`, OPC-only `tools/`, and legacy workflow files are preserved by reusing their existing Git tree/blob objects where possible. This avoids altering historical artifacts during migration.

## Tooling separation

Repository-wide reusable build/QA logic now lives in `tools/web-presentation/`. OPC-specific historical scripts remain project-local in `projects/opc-talent-community/tools/` so their original relative path assumptions continue to work.

The project `web-presentation.yaml` has been adapted to the shared toolchain schema. Its shared-pipeline output goes to `release/_staging/v0.4.1/` rather than the stable `release/v0.4.1/`, preventing accidental overwrite during regression testing.

## Parameterized Actions and regression

The repository now has:

- `.github/workflows/validate-web-presentation.yml` for automatic multi-project staging regression;
- `.github/workflows/finalize-web-presentation.yml` for parameterized finalize execution by `config_path`.

OPC V0.4.1 completed a full staging regression on GitHub Actions Run `34574105229` with conclusion `success`. The regression produced QA reports, browser renders, Contact Sheet, Standalone HTML, ZIP packaging and checksum artifacts without modifying the stable `release/v0.4.1/` tree.

## Compatibility status

Root-level legacy paths remain temporarily available only for compatibility. The migration has now passed the shared-toolchain and Actions regression gate, so the next phase may remove those legacy root paths while keeping Git history and the project-local copies intact.
