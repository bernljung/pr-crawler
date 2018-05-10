var Crawler = require('crawler');

const DOMAIN = 'https://www.avanza.se'

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
    uri: DOMAIN + '/placera/pressmeddelanden.html',
    jQuery: true,
    callback: startPageCallback
}]);