# Github Action : Give me a cool random message from this json file

## Usage:

Could be refreshing to inject some Larry David into your automated tasks

```
name: Larry says...

on:
  pull_request:
  push:
    branches:
      - main

jobs:
  check-version:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: johnnybenson/random-message-action@v1
        id: larry
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          JSON_FILE_PATH: larry.json
      - run: echo "${{ steps.larry.outputs.message }}"

```
