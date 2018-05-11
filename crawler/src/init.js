const http = require('http')
const Queuer = require('./modules/queuer')

const healthCheckServer = http.createServer((request, response) => {
  response.writeHead(200, {"Content-Type": 'application/json'})
  response.write('hello');
  response.end()
});

const queuer = new Queuer({
  domain: process.env.CRAWLER_DOMAIN,
  initialUrl: process.env.CRAWLER_INITIAL_URL
})

// const individualPMCallback = (error, res, done) => {
//   if (error) {
//     console.log('individualPmCallback error:', error)
//   } else {
//     const $ = res.$;
//     const companyName = $("article.feedArticle h1.SText div.upperCase.bold").text()
//     console.log("Company name: ", companyName)
//   }
//   done()
// }

const startApplication = async ()=>{
  try {
    console.log('Queuer starting...')
    await queuer.start()
    console.log('Queuer start complete')
    console.log('Starting health check...')
    healthCheckServer.listen(8080)
    console.log('Application up and running')
  } catch (err){
    console.error('Application start failed', {
      err,
      stack : err ? err.stack : undefined
    })
    process.exit(1)
  }
}

startApplication()