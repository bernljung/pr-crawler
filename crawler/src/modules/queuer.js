const Crawler = require('crawler')

class Queuer {
  constructor(params) {
    this.domain = params.domain
    this.initialUrl = params.initialUrl
    this.crawler = new Crawler({
      maxConnections : 1,
      callback : this.crawlerCallback.bind(this)
    });
  }

  crawlerCallback(error, res, done) {
    if(error){
      console.log('startPageCallback error: ', error);
    } else {
      const $ = res.$;
      $('li.oddItem a,li.evenItem a').map((i, item) => {
        // TODO: add link to mysql table
        // TODO: refactor this
        const pressReleaseLink = $(item).attr('href')
        console.log(pressReleaseLink)
        // this.crawler.queue([{
        //   uri: this.domain + pressReleaseLink,
        //   jQuery: true,
        //   callback: individualPMCallback
        // }]);
      })

      const viewMoreLink = $('.viewMoreLinkSecond.getMoreFeedArticlesLink').attr('href')
      this.crawler.queue([{
        uri: this.domain + viewMoreLink,
        jQuery: true,
        callback: this.viewMoreCallback.bind(this)
      }]);
    }
    done()
  }

  viewMoreCallback(error, res, done) {
    if(error){
      console.log('viewMoreCallback error: ', error);
    } else {
      const $ = res.$;
      $('li.oddItem a,li.evenItem a').map((i, item) => {
        // TODO: add link to mysql table
        // TODO: refactor this
        const pressReleaseLink = $(item).attr('href')
        console.log(pressReleaseLink)
        // this.crawler.queue([{
        //   uri: this.domain + pressReleaseLink,
        //   jQuery: true,
        //   callback: individualPMCallback
        // }]);
      })

      const viewMoreLink = $('#ajax-data').attr('data-more-link')
      this.crawler.queue([{
        uri: this.domain + viewMoreLink,
        jQuery: true,
        callback: this.viewMoreCallback.bind(this)
      }]);
    }
    done()
  }

  start() {
    this.crawler.queue([{
      uri: this.initialUrl,
      jQuery: true
    }]);
  }

  stop() {

  }
}

module.exports = Queuer