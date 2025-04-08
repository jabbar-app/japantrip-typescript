const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = require('http').createServer((req, res) => {
    handle(req, res)
  })
  
  server.listen(process.env.PORT || 3000)
}).catch(err => {
  console.error(err)
  process.exit(1)
})