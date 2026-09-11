# OPC Project Migration

The OPC presentation has been fully migrated into the multi-project workspace at `projects/opc-talent-community/`.

## Preserved historical trees

The historical `spec/`, `design/`, `prototype/`, `qa/`, `release/`, OPC-only `tools/`, and legacy workflow files were preserved by reusing their existing Git tree/blob objects where possible. This avoided altering historical artifacts during migration.

## Tooling separation

Repository-wide reusable build/QA logic lives in `tools/web-presentation/`. OPC-specific historical scripts remain project-local in `projects/opc-talent-community/tools/` so their original relative path assumptions continue to work.

The project `web-presentation.yaml` has been adapted to the shared toolchain schema. Its shared-pipeline output goes to `release/_staging/v0.4.1/` rather than the stable `release/v0.4.1/`, preventing accidental overwrite during regression testing.

## Automation verification

Parameterized GitHub Actions are active at repository level. A full OPC V0.4.1 staging regression passed through the shared toolchain, covering source audit, asset validation, browser layout QA, standalone generation, page rendering, contact sheet generation, release packaging and checksums.

## Cleanup status

After regression passed, the obsolete root-level OPC `spec/`, `design/`, `prototype/`, `qa/`, `release/`, historical finalize scripts, image-recovery directory and version-specific workflows were removed from the current branch. Their project-local copies and complete Git history remain preserved.

The migration now only requires the final repository integrity audit.
