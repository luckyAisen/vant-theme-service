import { Application } from 'express'
import morgan from 'morgan'
import { createStream, Generator } from 'rotating-file-stream'
import { parseTime, concatPath } from './utils'
import config from './config'
export default function log(app: Application): void {
  morgan.token('localDate', function getDate() {
    const date = new Date()
    return date.toLocaleString()
  })

  morgan.format(
    'combined',
    ':remote-addr - :remote-user [:localDate]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
  )

  const logName = (time: number | Date) => {
    return `${parseTime(
      !time ? new Date().getTime() : time,
      '{y}-{m}-{d}'
    )}.log`
  }

  const accessLogStream = createStream(logName as Generator, {
    size: '10M',
    interval: '1d',
    path: concatPath(config.cwd, 'log'),
  })

  app.use(
    morgan('combined', {
      stream: accessLogStream,
    })
  )
}
