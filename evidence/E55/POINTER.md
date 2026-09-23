# E55

- check: JRN-1 auto-kill emulation artifact
- expected: fps trace + poster-swap frame
- actual: vsync-shimmed starver: ~17fps sustained → monitor trips → canvas unmounts → poster; control 62fps survives
- verdict: PASS
- evidence: /evidence/specs/journey-emulation--{control-60fps,starved-under-30fps}.log + JRN-1/

(machine-generated from /evidence/MATRIX.md — 2026-09-23T00:34:17.597Z)
