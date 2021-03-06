# A Collection of Frontend Compilation Actions

This repository contains a selection of frontend compilation actions to ensure compiled/minified
files stay up to date when their source files are changed.

## Less Action
Compiles less source files to css using [`less`](https://www.npmjs.com/package/less).

## Inputs

| Name | Description | Required? | Example |
|---|---|---|---|
| `target` | Glob target directory or file to compile. Can be a single file, or many files | Y | `"src/less/**/*.less"` |
| `destination` | Location for the compiled sources (defaults to the same folder as the target file but with a `.css` extension instead of `.less`). Can be a directory or a precise file location, though you shouldn't use a precise file location if the target glob matches multiple files. If specifying a directory ensure this value ends with a slash. | N | `"src/css/"` |
| `modified` | Array of modified file paths serialised as JSON. If this action is being used in a sequence of steps which culminates in a commit step then you can use this input to pass in the current list of modified files. Defaults to [] if no provided. | N | `"[\"src/css/main.css\",\"src/css/extra.css\"]"` |

## Outputs
| Name | Description | Example |
| --- | --- | --- |
| `modified` | Array of modified file paths serialised as JSON. If chaining a series of steps and then committing the modifications this can be used to pass on the files that this step modified. If an input `modified` value was provided then any files modified by this step will be added to the list, otherwise a new list is started and populated. If no files are modified by this step then the modified value is passed on in the same form as it was at time of input. | `"[\"src/css/main.css\",\"src/css/extra.css\"]"` |

## Examples
### Compile a single file using default destination
_Compiles `src/less/main.less` -> `src/less/main.css`_
```yaml
name: Compile less
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1

      - uses: NaturalHistoryMuseum/compile-frontend-actions/less@v1.1.0
        with:
          target: 'src/less/main.less'
```

### Compile a single file into a different directory
_Compiles `src/less/main.less` -> `src/css/main.css`_
```yaml
name: Compile less
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1

      - uses: NaturalHistoryMuseum/compile-frontend-actions/less@v1.1.0
        with:
          target: 'src/less/main.less'
          destination: 'src/css/main.css'
```

### Compile a single file into a different directory using default renaming
_Compiles `src/less/extra.less` -> `src/extras/extra.css`_
```yaml
name: Compile less
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1

      - uses: NaturalHistoryMuseum/compile-frontend-actions/less@v1.1.0
        with:
          target: 'src/less/extra.less'
          destination: 'src/extras/'
```

### Compile a set of files using default renaming
_Compiles `src/**/*.less`_

Example results:
  - `src/less/main.less` -> `src/less/main.css`
  - `src/extras/extra.less` -> `src/extras/extra.css`
  - `src/fonts.less` -> `src/fonts.css`

```yaml
name: Compile less
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1

      - uses: NaturalHistoryMuseum/compile-frontend-actions/less@v1.1.0
        with:
          target: 'src/**/*.less'
```


## JS Action
Minifies javascript source files to `.min.js` files using [`terser`](https://www.npmjs.com/package/terser).

## Inputs
| Name | Description | Required? | Example |
|---|---|---|---|
| `target` | Glob target directory or file to minify. Can be a single file, or many files. _Note that existing `.min.js` are always ignored if they are found by the target glob, so you don't have to write some complicated glob that matches `.js` but not `.min.js`._ | Y | `"src/js/**/*.js"` |
| `destination` | Location for the minified sources (defaults to the same folder as the target file but with a `.min.js` extension instead of `.js`). Can be a directory or a precise file location, though you shouldn't use a precise file location if the target glob matches multiple files. If specifying a directory ensure this value ends with a slash. | N | `"src/js/"` |
| `modified` | Array of modified file paths serialised as JSON. If this action is being used in a sequence of steps which culminates in a commit step then you can use this input to pass in the current list of modified files. Defaults to [] if no provided. | N | `"[\"src/js/main.min.js\",\"src/js/extra.min.js\"]"` |

## Outputs
| Name | Description | Example |
| --- | --- | --- |
| `modified` | Array of modified file paths serialised as JSON. If chaining a series of steps and then committing the modifications this can be used to pass on the files that this step modified. If an input `modified` value was provided then any files modified by this step will be added to the list, otherwise a new list is started and populated. If no files are modified by this step then the modified value is passed on in the same form as it was at time of input. | `"[\"src/js/main.min.js\",\"src/js/extra.min.js\"]"` |

## Examples
### Minify a single file using default destination
_Minifies `src/js/main.js` -> `src/js/main.min.js`_
```yaml
name: Minify js
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1

      - uses: NaturalHistoryMuseum/compile-frontend-actions/js@v1.1.0
        with:
          target: 'src/js/main.js'
```

### Minify a single file into a different directory
_Minifies `src/js/main.js` -> `src/prod/main.min.js`_
```yaml
name: Minify js
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1

      - uses: NaturalHistoryMuseum/compile-frontend-actions/js@v1.1.0
        with:
          target: 'src/js/main.js'
          destination: 'src/prod/main.min.js'
```

### Minify a single file into a different directory using default renaming
_Minifies `src/js/extra.js` -> `src/extras/extra.min.js`_
```yaml
name: Minifiy js
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1

      - uses: NaturalHistoryMuseum/compile-frontend-actions/js@v1.1.0
        with:
          target: 'src/js/extra.js'
          destination: 'src/extras/'
```

### Minify a set of files using default renaming
_Minifies `src/**/*.js`_

Example results:
  - `src/js/main.js` -> `src/js/main.min.js`
  - `src/extras/extra.js` -> `src/extras/extra.min.js`
  - `src/utils.js` -> `src/utils.min.js`

```yaml
name: Compile js
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1

      - uses: NaturalHistoryMuseum/compile-frontend-actions/js@v1.1.0
        with:
          target: 'src/**/*.js'
```


## Putting it all together
You probably want to commit your changes after running the above actions, here's an example of how to do that:

```yaml
name: Update production frontend code
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1

      # first, compile the less
      - uses: NaturalHistoryMuseum/compile-frontend-actions/less@v1.1.0
        # give this step an id so that we can reference its outputs in the next step
        id: less
        with:
          target: src/less/main.less

      # next, minify the javascript
      - uses: NaturalHistoryMuseum/compile-frontend-actions/js@v1.1.0
        id: js
        with:
          target: src/js/main.js
          # pass in the modified output of the less step
          modified: ${{ steps.less.outputs.modified }}

      - name: Commit and push changes
        if: steps.js.outputs.modified != '[]'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          MODIFIED: ${{ steps.js.outputs.modified }}
        run: |
          git config user.name "Compile action on behalf of $GITHUB_ACTOR"
          git config user.email "$GITHUB_ACTOR@users.noreply.github.com"
          git checkout `echo $GITHUB_REF | cut -d'/' -f3-`
          git add `echo $MODIFIED | jq -r 'join(" ")'`
          git commit -m "[bot] Update production frontend files"
          git push "https://$GITHUB_ACTOR:$GITHUB_TOKEN@github.com/$GITHUB_REPOSITORY.git" `echo $GITHUB_REF | cut -d'/' -f3-`
```

## Local development
Sometimes you may want to run these actions locally during development and to facilitate this in the `bin/` directory there are bash scripts for the `less` and `js` actions. These take the inputs as parameters, for example:

```bash
./bin/js.sh "{less,js}/*.js"
```

will minify the js files found in the `less/` and `js/` directories.

These are provided for convenience :)
