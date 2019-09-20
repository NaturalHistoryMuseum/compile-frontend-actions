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

      - uses: jrdh/compile-frontend-action/less@master
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

      - uses: jrdh/compile-frontend-action/less@master
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

      - uses: jrdh/compile-frontend-action/less@master
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

      - uses: jrdh/compile-frontend-action/less@master
        with:
          target: 'src/**/*.less'
```
