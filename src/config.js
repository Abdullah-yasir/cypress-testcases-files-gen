const { getUserConfig } = require('./helpers')

const CONFIG_FILENAME = 'gen-config.json'

const defaultConfig = {
    paths: {
        e2e: ['e2e'],
        fixtures: ['fixtures'],
        testCases: ['support', 'TestCases'],
    },
    nameValidationRegex: / /g,
}

const config = getUserConfig(CONFIG_FILENAME, defaultConfig)

module.exports = config
