#!/bin/bash

# Description: This script lists all files in the ./src folder (recursively),
# concatenates their contents, and copies the result to the macOS clipboard.

# Ensure the src directory exists
if [ ! -d "./src" ]; then
  echo "Error: ./src folder does not exist."
  exit 1
fi

# Create a temporary file to store concatenated content
temp_file=$(mktemp)

# Find all files in the ./src directory recursively and output their paths
# Also concatenate their contents into the temporary file
echo "Listing and concatenating files in ./src:"
find ./src -type f \( -name "*.css" -o -name "*.js" \) -print -exec cat {} >> "$temp_file" \;

# Copy the concatenated content to the clipboard
cat "$temp_file" | pbcopy

# Clean up the temporary file
rm "$temp_file"

echo "All file contents have been copied to the clipboard!"
