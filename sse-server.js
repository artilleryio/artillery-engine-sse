const express = require('express')
const SseStream = require('ssestream').default;

const app = express()
app.get('/sse', (req, res) => {
  console.log('new connection')

  const sseStream = new SseStream(req)
  sseStream.pipe(res)
  const pusher = setInterval(() => {
    sseStream.write({
      event: 'server-time',
      data: new Date().toTimeString()
    })

    sseStream.write({
      data: 'hello'
    })
  }, 1000)

  res.on('close', () => {
    console.log('lost connection')
    clearInterval(pusher)
    sseStream.unpipe(res)
  })
})

app.listen(8080, (err) => {
  if (err) throw err
  console.log('server ready on http://localhost:8080')
})
