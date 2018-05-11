const Crawler = require('crawler');

const DOMAIN = process.env.CRAWLER_DOMAIN
const INITIAL_URL = process.env.CRAWLER_INITIAL_URL

var c = new Crawler({
    maxConnections : 1,
    callback : (error, res, done) => { done() }
});

const startPageCallback = (error, res, done) => {
  if(error){
    console.log('startPageCallback error: ', error);
  } else {
    const $ = res.$;
    $('li.oddItem a,li.evenItem a').map((i, item) => {
      const pressReleaseLink = $(item).attr('href')
      c.queue([{
        uri: DOMAIN + pressReleaseLink,
        jQuery: true,
        callback: individualPMCallback
      }]);
    })

    const viewMoreLink = $('.viewMoreLinkSecond.getMoreFeedArticlesLink').attr('href')
    c.queue([{
      uri: DOMAIN + viewMoreLink,
      jQuery: true,
      callback: viewMoreCallback
    }]);
  }
  done()
}

const viewMoreCallback = (error, res, done) => {
  if(error){
    console.log('viewMoreCallback error: ', error);
  } else {
    const $ = res.$;
    $('li.oddItem a,li.evenItem a').map((i, item) => {
      const pressReleaseLink = $(item).attr('href')
      c.queue([{
        uri: DOMAIN + pressReleaseLink,
        jQuery: true,
        callback: individualPMCallback
      }]);
    })

    const viewMoreLink = $('#ajax-data').attr('data-more-link')
    c.queue([{
      uri: DOMAIN + viewMoreLink,
      jQuery: true,
      callback: viewMoreCallback
    }]);
  }
  done()
}

const individualPMCallback = (error, res, done) => {
  if (error) {
    console.log('individualPmCallback error:', error)
  } else {
    const $ = res.$;
    const companyName = $("article.feedArticle h1.SText div.upperCase.bold").text()
    console.log("Company name: ", companyName)
  }
  done()
}

c.queue([{
    uri: INITIAL_URL,
    jQuery: true,
    callback: startPageCallback
}]);


// Dummy for health check in docker upstart
const http = require('http')
const server = http.createServer((request, response) => {
  response.writeHead(200, {"Content-Type": 'application/json'})
  response.write('hello');
  response.end()
});

server.listen(8080)