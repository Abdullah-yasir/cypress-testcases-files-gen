## Getting Started

`cygen` is a node.js CLI tool that creates template files, in their respective folders, with boilerplate code and file extension.

To install the CLI:

```bash
# 1. Clone this repo
git clone https://github.com/Abdullah-yasir/cypress-testcases-files-gen.git

# 2. `cd` to clonned project directory
cd cypress-testcases-files-gen

# 3. Install the dependencies
npm install

#4. Install the tool globally in your system
npm install . -g
```

## Creating Test Case Template

Syntax

```bash
cygen <testCaseName> [fixture]
```

For example if you want to create files for _XYZ-123_SomeTestCase_ test case  
Run

```bash
cygen XYZ-123_SomeTestCase
```

> Note that we've given no file extension above.

Running above command will ask you to:

1.  Select the folder to put test case in ( if e2e dir contains directories ).
2.  Enter description of the test case.

After hitting `enter` it creates two files:

-   `cypress/e2e/TestCases/<folder>/XYZ-123_SomeTestCase.cy.js`
-   `cypress/support/TestCases/<folder>/XYZ-123_SomeTestCase.js`

ℹ️ _If files exist already, it will skip those and won't overwrite them._

If fixture file is also needed, pass `--fixture` flag at the end. i.e.

Run

```bash
cygen XYZ-123_SomeTestCase --fixture
```

Now above command creates three files:

-   `cypress/e2e/TestCases/<folder>/XYZ-123_SomeTestCase.cy.js`
-   `cypress/support/TestCases/<folder>/XYZ-123_SomeTestCase.js`
-   `cypress/fixtures/<folder>/XYZ-123_SomeTestCase.json`

To show help

```bash
cygen help
```
