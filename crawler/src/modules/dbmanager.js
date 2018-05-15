const mysql = require('promise-mysql')

class DBManager {
  constructor(params) {
    this.pool = null
    this.host = params.host
    this.user = params.user
    this.password = params.password
    this.database = params.database
    this.connectionLimit = params.connectionLimit
    this.queueBatchSize = params.queueBatchSize
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

  insertPressRelease(site) {
    return this.pool.query('INSERT IGNORE INTO press_releases SET ?', site).then(rows => {
      console.log('Inserted ', site.url)
    }
  ).catch(e => {
    console.log('ERROR inserting', site)
  });
  }

  async fetchQueue() {
    let queue = []
    let batchSize = null
    let offset = 0
    while (batchSize === null || batchSize === this.queueBatchSize) {
      const queueBatch = await this._getQueueBatch(offset)
      batchSize = queueBatch.length
      offset = offset + batchSize
      if (queueBatch) {
        queue = queue.concat(queueBatch)
        console.log('Queue size:', queue.length)
      }
    }
    return queue
  }

  _getQueueBatch(offset) {
    return this.pool.query('SELECT * FROM crawler_queue ORDER BY prio DESC LIMIT ? OFFSET ?',
      [this.queueBatchSize, offset])
  }

  deleteCrawlerQueueItem(id) {
    return this.pool.query('DELETE FROM crawler_queue WHERE id = ?',
      [id])
  }
}

module.exports = DBManager