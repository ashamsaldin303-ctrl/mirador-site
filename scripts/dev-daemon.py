#!/usr/bin/env python3
"""Double-fork daemon launcher for the MIRADOR dev server (sandbox: tool-call
cleanup kills session-descended processes; a properly daemonized process
reparents to init and survives). Usage: python3 scripts/dev-daemon.py"""
import os, sys

if os.fork() > 0:
    sys.exit(0)
os.setsid()
if os.fork() > 0:
    sys.exit(0)

os.chdir("/home/z/my-project")

# Project .env is the source of truth for the dev daemon: the sandbox session
# injects its own DATABASE_URL (template SQLite) into every shell — that value
# would poison the PostgreSQL-backed Prisma client at runtime (init-time
# P1012-style URL validation). Load .env here (quotes stripped, .env wins)
# before exec so the daemon always matches the project's declared database.
env = dict(os.environ)
with open("/home/z/my-project/.env") as f:
    for line in f:
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        env[key.strip()] = value.strip().strip('"').strip("'")

devnull = os.open(os.devnull, os.O_RDONLY)
os.dup2(devnull, 0)
out = os.open(os.devnull, os.O_WRONLY)
os.dup2(out, 1)
os.dup2(out, 2)
os.execvpe("bun", ["bun", "run", "dev"], env)
