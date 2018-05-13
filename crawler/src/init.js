const http = require('http')
const Queuer = require('./modules/queuer')
const DBManager = require('./modules/dbmanager')

const healthCheckServer = http.createServer((request, response) => {
  response.writeHead(200, {"Content-Type": 'application/json'})
  response.write('hello');
  response.end()
});

const dbManager = new DBManager({
  host: process.env.CRAWLER_DATABASE_HOST,
  connectionLimit: process.env.CRAWLER_DATABASE_CONNECTION_LIMIT,
  user: process.env.CRAWLER_DATABASE_USER,
  password: process.env.CRAWLER_DATABASE_PASSWORD,
  database: process.env.CRAWLER_DATABASE_DATABASE
})

const queuer = new Queuer({
  domain: process.env.CRAWLER_DOMAIN,
  initialUrl: process.env.CRAWLER_INITIAL_URL,
  dbManager: dbManager
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
    console.log('DB Manager starting...')
    await dbManager.start()
    console.log('Queuer starting...')
    await queuer.start()
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