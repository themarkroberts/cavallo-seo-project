#!/bin/bash
# Double-click this from Finder, or keep it in your Dock.
# Fetches fresh numbers, rebuilds the dashboard, and opens it.
cd "$(dirname "$0")" || exit 1

echo "Cavallo dashboard — fetching fresh numbers…"
echo

if ! npm run --silent refresh; then
  echo
  echo "Could not fetch fresh numbers (see the error above)."
  echo "Opening the dashboard with the numbers from last time instead."
  echo
fi

npm run --silent build || { echo "Build failed. Nothing to open."; read -n 1 -s -r -p "Press any key to close."; exit 1; }

open dashboard.html
echo
echo "Done. This window can be closed."
