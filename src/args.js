const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage')
const fs = require('fs');

const {description, name, version} = require('../package.json');
const optionDefinitions = [
    { name: 'in', type: String, description: `The .src folder to be stripped.`},
    { name: 'length', alias: 'l', type: Number, description: 'The number of directories to strip starting from the left. '},
    { name: 'force', alias: 'f', type: Boolean, description: 'Recreate directory structure'},
    { name: 'verbose', alias: 'v', type: Boolean, description: 'Display verbose output.'}
]




const validate = (options) => {
    const {in: inArg} = options;
    if (inArg && fs.existsSync(inArg)) return true;
    if (!inArg)
    throw new Error(`Missing argument {bold '--in'}`)
    if (!fs.existsSync(inArg))
    throw new Error(`Target dir '${inArg}' does not exist.`)
}

let options;
try {
    options = commandLineArgs(optionDefinitions)
    validate(options);
} catch (e) {
    let message = e.message;

    if (/Unknown option: --/.test(message) && message.length == 19) {
        message += `\nOne letter options take a single dash: ${message.slice(-2)}`
    }
    const sections = [
        {
            header: `Error`,
            content: message
        },
        {
          header: `${name} [${version}]`,
          content: description
        },
        {
          header: 'Options',
          optionList: optionDefinitions
        }
      ]
    const usage = commandLineUsage(sections)

    console.log(usage);
    process.exit(0);
}

module.exports = options;