#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env.local"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: .env.local not found at $ENV_FILE"
    exit 1
fi

ADMIN_KEY=$(grep CONVEX_SELF_HOSTED_ADMIN_KEY "$ENV_FILE" | cut -d '=' -f2-)
URL=$(grep CONVEX_SELF_HOSTED_URL "$ENV_FILE" | cut -d '=' -f2-)

if [ -z "$ADMIN_KEY" ]; then
    echo "Error: CONVEX_SELF_HOSTED_ADMIN_KEY not set in .env.local"
    exit 1
fi

if [ -z "$URL" ]; then
    URL="http://127.0.0.1:3210"
fi

cd "$SCRIPT_DIR"

echo "Importing scores..."
npx convex import --table scores sample-leaderboard.jsonl --url "$URL" --admin-key "$ADMIN_KEY" --replace --yes

echo "Importing daily challenges..."
npx convex import --table dailyChallenge sample-challenge.jsonl --url "$URL" --admin-key "$ADMIN_KEY" --replace --yes

echo "Done!"
