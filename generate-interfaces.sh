#!/usr/bin/env bash
rm -rf src/interfaces
mkdir -p src/interfaces
for file in "$@"; do
    npx json2ts "$file" "src/interfaces/$(basename "$file" .json).ts"
done
npx prettier --write "src/interfaces"
