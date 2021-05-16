import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import { createStream, Generator } from 'rotating-file-stream'
import { parseTime } from './utils'
import less from 'less'
import path from 'path'
import fs from 'fs'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const LessPluginCleanCSS = require('less-plugin-clean-css')

const app = express()

const port = 5000

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))

function log() {
  // 自定义token
  morgan.token('localDate', function getDate(req) {
    const date = new Date()
    return date.toLocaleString()
  })

  const logName = (time: number | Date) => {
    if (!time) return 'log.log'
    const timeStr = parseTime(time, '{y}-{m}-{d}-{h}-{i}-{s}')
    return `${timeStr}-file.log`
  }
  const logPath = process.cwd()
  const accessLogStream = createStream(logName as Generator, {
    size: '10M',
    interval: '1d',
    path: path.join(logPath, 'log'),
  })
  morgan.format(
    'combined',
    ':remote-addr - :remote-user [:localDate]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
  )
  app.use(
    morgan('combined', {
      stream: accessLogStream,
    })
  )
}

function service() {
  log()
  app.post('/compiler', async function (req, res) {
    try {
      const input = fs.readFileSync(`./src/styles/3.x/index.less`, 'utf8')
      let str = ''
      for (const [key] of Object.entries(req.body)) {
        str += `@${key}:${req.body[key]};\n`
      }
      const options = {
        plugins: [new LessPluginCleanCSS({ advanced: true })],
      }
      const { css }: { css: string } = await less.render(input + str, options)
      res.send(css)
    } catch (err) {
      res.status(500).send(err)
      console.log(err)
    }
  })
  app.listen(port, () => console.log(`Server is listening on port ${port}!`))
}

service()
