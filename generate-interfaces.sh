#!/usr/bin/env bash
rm -rf src/interfaces
for file in "$@"; do
    npx json2ts "$file" "src/interfaces/$(basename "$file" .json).ts"
done
npx prettier src/interfaces --write
