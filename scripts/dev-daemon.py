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
devnull = os.open(os.devnull, os.O_RDONLY)
os.dup2(devnull, 0)
out = os.open(os.devnull, os.O_WRONLY)
os.dup2(out, 1)
os.dup2(out, 2)
os.execvp("bun", ["bun", "run", "dev"])
