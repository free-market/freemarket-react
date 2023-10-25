#!/bin/bash


if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <argument>"
  exit 1
fi

set +e
git push origin :freemarket-react-$1
git tag -d freemarket-react-$1 
git tag freemarket-react-$1 
git push origin freemarket-react-$1
