## Creating Test Case Template

`cy-gen` is a node script that creates template files, in their respective folders, with boilerplate code and file extension.

Syntax

```bash
cy-gen <testCaseName> [fixture]
```

For example if you want to create files for _XYZ-123_SomeTestCase_ test case  
Run

```bash
cy-gen XYZ-123_SomeTestCase
```

> Note that we've given no file extension above.

Running above command will ask you to:

-   Select the folder to put test case in.
-   Enter description of the test case.

After hitting `enter` it creates two files:

-   `cypress/e2e/TestCases/<folder>/XYZ-123_SomeTestCase.cy.js`
-   `cypress/support/TestCases/<folder>/XYZ-123_SomeTestCase.js`

ℹ️ _If files exist already, it will skip those and won't overwrite them._

If fixture file is also needed, pass `--fixture` flag at the end. i.e.

Run

```bash
cy-gen XYZ-123_SomeTestCase --fixture
```

Now above command creates three files:

-   `cypress/e2e/TestCases/<folder>/XYZ-123_SomeTestCase.cy.js`
-   `cypress/support/TestCases/<folder>/XYZ-123_SomeTestCase.js`
-   `cypress/fixtures/<folder>/XYZ-123_SomeTestCase.json`

To show help

```bash
cy-gen help
```
