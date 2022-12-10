const path = require('path')
const {
    selectChildFolderResursive,
    createFileIfNotExists,
    appendImportInFile,
    mkdirIfNotExists,
    getCypressPath,
    validateInput,
    changeDir,
    getArgs,
    ask,
} = require('./helpers')
const { printHelp, genCyFile, genTestFile, getFixtureImport, genFixture } = require('./templates')

const config = require('./config')

async function main() {
    try {
        const { showHelp, testCaseName: testFile, isFixtureNeeded } = getArgs()
        const paths = config.paths

        if (showHelp) return printHelp()

        const functionName = validateInput(testFile, 'testCaseName is required!').replace('-', '')

        let [, ...folders] = await selectChildFolderResursive(...paths.e2e)

        mkdirIfNotExists(getCypressPath(...paths.e2e, ...folders))
        mkdirIfNotExists(getCypressPath(...paths.testCases, ...folders))

        const [cyFilePath, fixturePath, testFilePath] = [
            [...paths.e2e, ...folders, testFile + '.cy.js'],
            [...paths.fixtures, ...folders, testFile + '.json'],
            [...paths.testCases, ...folders, testFile + '.js'],
        ].map(p => path.join(...p))

        const description = await ask('Description: ')

        // Create cy file
        createFileIfNotExists(
            getCypressPath(cyFilePath),
            genCyFile(
                functionName,
                description,
                path.join(changeDir(...paths.e2e, ...folders), testFilePath)
            )
        )

        // Create test file
        createFileIfNotExists(getCypressPath(testFilePath), genTestFile(functionName))

        // Create fixture file
        if (isFixtureNeeded) {
            // Create folder in fixtures if not exists
            mkdirIfNotExists(getCypressPath('fixtures', ...folders))

            // Create fixture file
            createFileIfNotExists(getCypressPath(fixturePath), genFixture())

            // Add fixture import in Test File, if not present
            appendImportInFile(
                getFixtureImport(
                    functionName,
                    path.join(changeDir(...paths.testCases, ...folders), fixturePath)
                ),
                getCypressPath(testFilePath)
            )
        }
    } catch (err) {
        console.log(err)
        printHelp()
        process.exit()
    }
}

module.exports = main
