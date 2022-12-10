const { filterName, noBackSlash } = require('./helpers')

function genCyFile(functionName, description, testFilePath) {
    return `import ${functionName} from "${noBackSlash(testFilePath)}";

describe("Test Case Automated: ", () => {
  it("${description}", () => {
    ${functionName}();
  });
});
`
}

function genTestFile(functionName) {
    return `export default function ${filterName(functionName)}() {
  // #1.
  // #2.
  // #3.
}
`
}

function genFixture() {
    return '{}'
}

function getFixtureImport(functionName, fixturePath) {
    return `import ${filterName(functionName)}Data from "${noBackSlash(fixturePath)}";`
}

function printHelp() {
    const help = `Template Gen Tool, Help:
  Args                Required    Description

  testCaseName        Yes         Name of the test case, without file extension
  fixture, --fixture  No          Flag, create fixture file
  `

    console.log(help)
}

module.exports = {
    getFixtureImport,
    genTestFile,
    genFixture,
    filterName,
    genCyFile,
    printHelp,
}
