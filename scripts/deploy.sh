#!/usr/bin/env bash
# Deploy: push to GitHub (Pages) and publish to surge.
# Usage: scripts/deploy.sh "commit message"
set -euo pipefail
cd "$(dirname "$0")/.."

MSG="${1:-site update}"

# sanity: engine tests must pass before anything ships
node tests/engine.test.js

git add -A
git commit -m "$MSG" || echo "nothing to commit"
if git remote get-url origin >/dev/null 2>&1; then
  git push origin main
else
  echo "no origin remote yet — skipping GitHub push"
fi

# surge domain is stored in ./CNAME.surge (not the GitHub CNAME file)
if [ -f CNAME.surge ]; then
  surge . "$(cat CNAME.surge)"
else
  echo "no CNAME.surge — skipping surge publish"
fi

echo "deployed."
