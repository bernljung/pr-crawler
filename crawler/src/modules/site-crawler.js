const Crawler = require('crawler')

class SiteCrawler {
  constructor(params) {
    this.dbManager = params.dbManager
    this.crawler = new Crawler({
      rateLimit: 200,
      maxConnections : 1
    });
  }

  async start() {
    const queue = await this.dbManager.fetchQueue()
    queue.forEach(site => {
      this.crawler.queue([{
        uri: site.url,
        jQuery: true,
        callback: (error, res, done) => {
          if (error) {
            console.log('individualPmCallback error:', error)
          } else {
            const $ = res.$;
            const corporation = $("article.feedArticle h1.SText div.upperCase.bold").text()
            const eventDate = $("article.feedArticle header div").not('.upperCase.bold').text()
            const text = $("article.feedArticle").children().eq(1).text().trim()
            if(corporation && text && eventDate) {
              this.dbManager.insertPressRelease({
                event_date: eventDate,
                corporation: corporation,
                text: text,
                url: site.url
              })
            }
            this.dbManager.deleteCrawlerQueueItem(site.id)
          }
          done()
        }
      }])
    })
  }
}

module.exports = SiteCrawler