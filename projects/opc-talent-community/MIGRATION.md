# OPC Project Migration

The OPC presentation now has a formal project-local workspace under `projects/opc-talent-community/`.

## Preserved historical trees

The historical `spec/`, `design/`, `prototype/`, `qa/`, `release/`, OPC-only `tools/`, and legacy workflow files are preserved by reusing their existing Git tree/blob objects where possible. This avoids altering historical artifacts during migration.

## Tooling separation

Repository-wide reusable build/QA logic now lives in `tools/web-presentation/`. OPC-specific historical scripts remain project-local in `projects/opc-talent-community/tools/` so their original relative path assumptions continue to work.

The project `web-presentation.yaml` has been adapted to the shared toolchain schema. Its shared-pipeline output goes to `release/_staging/v0.4.1/` rather than the stable `release/v0.4.1/`, preventing accidental overwrite during regression testing.

## Compatibility status

Root-level legacy paths remain temporarily available. Cleanup is blocked until 3-5 completes parameterized GitHub Actions and regression verification.
