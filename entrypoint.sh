#!/bin/sh -l

git clone --quiet https://github.com/$REPO &> /dev/null

git config --global --add safe.directory /github/workspace

tag=$(git tag --sort version:refname | tail -n 2 | head -n 1)

if [ "$tag" ]; then
  changelog=$(git log --oneline --no-decorate $tag..HEAD)
else
  changelog=$(git log --oneline --no-decorate)
fi

echo "$changelog"

# Format as markdown list
changelog=$(echo "$changelog" | sed 's/^/ - /')

{
  echo "changelog<<EOF"
  echo "$changelog"
  echo "EOF"
} >> "$GITHUB_OUTPUT"
