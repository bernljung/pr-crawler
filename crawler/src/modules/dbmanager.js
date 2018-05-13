const mysql = require('promise-mysql')

class DBManager {
  constructor(params) {
    this.pool = null
    this.connectionLimit = params.connectionLimit
    this.host = params.host
    this.user = params.user
    this.password = params.password
    this.database = params.database
  }

  start() {
    this.pool = mysql.createPool({
      connectionLimit: this.connectionLimit,
      host: this.host,
      user: this.user,
      password: this.password,
      database: this.database
    });
  }

  queueUrl(site) {
    this.pool.query('INSERT IGNORE INTO crawler_queue SET ?', site).then(rows => {
        console.log('Inserted ', site.url)
      }
    ).catch(e => {
      console.log('ERROR inserting', site)
    });
  }
}

module.exports = DBManager