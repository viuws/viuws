#!/usr/bin/env bash
for file in "$@"; do
    npx json2ts "$file" "src/interfaces/$(basename "$file" .json).ts"
done
