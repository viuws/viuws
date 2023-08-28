#!/usr/bin/env bash
for file in "$@"; do
    stem=$(basename "$file" .json)
    npx json2ts "$file" "src/interfaces/${stem^}.ts"
done
