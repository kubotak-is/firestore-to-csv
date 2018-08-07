const admin = require('firebase-admin')
const Json2csvParser = require('json2csv').Parser

module.exports = class FirestoreToCsvAction {
  constructor(config) {
    this.config = config
    admin.initializeApp({
      apiKey: config.API_KEY,
      databaseURL: config.DB_URL,
      projectId: config.PROJECT_ID,
    })
    this.db = admin.firestore()
    this.db.settings({timestampsInSnapshots: true})
  }

  run(document) {
    const parser = new Json2csvParser()
    return this._find(document).then(data => {
      return parser.parse(data)
    })
  }

  _find(document) {
    let data = []
    return this.db.collection(document).get().then(snapshot => {
      snapshot.forEach(doc => {
        data.push(doc.data())
      })
      return data
    })
  }
}
