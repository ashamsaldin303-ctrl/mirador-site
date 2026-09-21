# BLOCKED — F6-3 · E3 — lazy three-chunk size

See /evidence/F12-2/BLOCKED.md (single root record for all build-gated
artifacts). This AC is BLOCKED-by-policy in this container: no production
build exists, so the lazy-chunk size row (three/fiber/drei ≤400KB gz) and its
absence-from-first-load proof cannot be produced. Dev-mode bundles would
misrepresent the metric and are refused as evidence (N16/N17).

Resolution: /evidence/REPLAY.md §build · docs/deploy-pre.md checklist.
