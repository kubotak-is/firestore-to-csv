const {Command, flags} = require('@oclif/command')
const env = require('dotenv').config()
const fs = require('fs')
const FirestoreToCsvAction = require('./Action/firestore-to-csv-action')

class FirestoreToCsvCommand extends Command {
  async run() {
    if (env.error) {
      throw env.error
    }
    const {flags} = this.parse(FirestoreToCsvCommand)
    const action = new FirestoreToCsvAction(env.parsed)
    action.run(flags.document, flags.path).then(csv => {
      let exportPath = flags.path || '.'
      let fileName = flags.name || 'export'
      fs.writeFileSync(`${exportPath}/${fileName}.csv`, csv)
      this.log(`exported: ${exportPath}/${fileName}.csv`)
    })
  }
}

FirestoreToCsvCommand.description = `Describe the command here
...
Extra documentation goes here
`

FirestoreToCsvCommand.flags = {
  // add --version flag to show CLI version
  version: flags.version({char: 'v'}),
  // add --help flag to show CLI version
  help: flags.help({char: 'h'}),
  path: flags.string({char: 'p', description: 'export path'}),
  name: flags.string({char: 'n', description: 'export file name'}),
  document: flags.string({required: true, char: 'd', description: 'firestore document name'}),
}

module.exports = FirestoreToCsvCommand
