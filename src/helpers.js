const fs = require('fs')
const readline = require('readline')

const path = require('path')
const cliSelect = require('cli-select')

async function selectChildFolderResursive(parentFolder, foldersList = []) {
    const [ROOT, CREATE_NEW_FOLDER] = ['__root__', '__create_new_folder__']

    let folders = foldersList.concat(parentFolder)
    const childFolders = getChildFolders(...folders)

    if (!childFolders || !childFolders.length) return folders

    const selectedFolder = await selectOption(
        `Select Folder in ${folders.at(-1)}`,
        [].concat(ROOT, childFolders, CREATE_NEW_FOLDER)
    )

    if (selectedFolder === ROOT) return folders

    if (selectedFolder === CREATE_NEW_FOLDER) {
        let newFolderName = await ask('New Folder Name: ')
        newFolderName = validateInput(newFolderName?.trim(), 'Invalid Folder Name!')
        newFolderName = newFolderName.replace(/ /g, '_')
        folders.push(newFolderName)
    } else {
        folders = await selectChildFolderResursive(selectedFolder, folders)
    }

    return folders
}

function changeDir(...paths) {
    return path.join(...paths.map(() => '..'))
}

function getArgs() {
    const [, , testCaseName, optionFlag] = process.argv
    const isFixtureNeeded = optionFlag === 'fixture' || optionFlag === '--fixture'
    let showHelp = false

    if (testCaseName === '-h' || testCaseName === '--help' || testCaseName === 'help') {
        showHelp = true
    }

    return { showHelp, testCaseName, isFixtureNeeded }
}

function ask(question) {
    return new Promise(resolve => {
        const reader = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        })

        reader.question(question, desc => {
            resolve(desc)
            reader.close()
        })
    })
}

async function selectOption(msg, options) {
    console.log(msg)
    const selected = await cliSelect({ values: options })
    return selected.value
}

function validateInput(input, validationMessage) {
    if (!input || !input.length) throw new Error(validationMessage)
    return input
}

function appendImportInFile(importStatement, fileName) {
    // Check if `import` statement exists in the file
    let fileContents = fs.readFileSync(fileName).toString()
    const requestedImportInFile = fileContents.match(new RegExp(importStatement, 'g'))

    // If import is not present in file, append an import
    if (!requestedImportInFile) {
        const imports = matchImports(fileContents)?.join('\n') // `imports` can be null || []

        // If there are already some import statements
        if (imports) {
            let newImports = appendNewLine(imports) + importStatement
            fileContents = fileContents.replace(imports, newImports)
        } else {
            fileContents = appendNewLine(importStatement, 2) + fileContents
        }

        fs.writeFileSync(fileName, fileContents)
        console.log('✅ Added Import:', importStatement)
        console.log('In: ', fileName)
    }
}

function getCypressPath(...paths) {
    return getAbsPath('..', 'cypress', ...paths)
}

function noBackSlash(string) {
    return string.replace(/\\/g, '/')
}

function getChildFolders(...parentFolderPath) {
    return fs
        .readdirSync(getCypressPath(...parentFolderPath), {
            withFileTypes: true,
        })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
}

function getAbsPath(...paths) {
    return path.join(__dirname, ...paths)
}

function filterName(name) {
    if (name.includes('/')) {
        return name.split('/').at(-1)
    }

    return name
}

function matchImports(contents) {
    const re = /import(?:["'\s]*([\w*{}\n\r\t, ]+)from\s*)?["'\s].*([@\w_-]+)["'\s].*;$/gm

    return contents.toString().match(re)
}

function appendNewLine(content, lines = 1) {
    if (!content) return ''

    return (
        content +
        Array.from(Array(lines).keys())
            .map(() => '\n')
            .join('')
    )
}

function createFileIfNotExists(filePath, contents) {
    // Do not overrite existing files
    if (fs.existsSync(filePath)) {
        console.log('❗️ Exists Already: ', appendNewLine(filePath))
        return
    }
    fs.writeFileSync(filePath, contents)
    console.log('✅ Created File: ', appendNewLine(filePath))
}

function mkdirIfNotExists(dirName) {
    if (fs.existsSync(dirName)) {
        console.log('Dir Exists Already: ', dirName)
        return
    }

    fs.mkdirSync(dirName)
}

function getUserConfig(configFile, _default = {}) {
    if (fs.existsSync(configFile)) {
        const fileContents = fs.readFileSync(configFile, {
            encoding: 'utf8',
            flag: 'r',
        })
        return JSON.parse(fileContents)
    }
    return _default
}

module.exports = {
    selectChildFolderResursive,
    createFileIfNotExists,
    appendImportInFile,
    mkdirIfNotExists,
    getCypressPath,
    getUserConfig,
    appendNewLine,
    validateInput,
    matchImports,
    noBackSlash,
    filterName,
    getAbsPath,
    changeDir,
    getArgs,
    ask,
}
