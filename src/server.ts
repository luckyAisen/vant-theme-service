import express from 'express'
// import bodyParser from 'body-parser'
import fs from 'fs-extra'
import less from 'less'
import { concatPath } from './utils'
import config from './config'
import logMiddlewares from './logMiddlewares'
import { Version } from 'interface'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const LessPluginCleanCSS = require('less-plugin-clean-css')

const app = express()

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

logMiddlewares(app)

function service() {
  app.post('/compiler', async function (req, res) {
    try {
      const version = req.query.version as keyof Version
      const dir = concatPath(config.dirPath.styleDir, version, 'index.less')
      if (!config.version[version]) throw new Error('version has no exist')
      const input = fs.readFileSync(dir, 'utf8')
      const global = req.body.global || {}
      const local = req.body.local || {}
      let str = ''
      for (const [key] of Object.entries(global)) {
        str += `${key}:${global[key]};\n`
      }
      for (const [key] of Object.entries(local)) {
        str += `${key}:${local[key]};\n`
      }
      // console.log(global)
      // console.log(local)
      // console.log(input)
      // console.log(str)
      const options = {
        plugins: [new LessPluginCleanCSS({ advanced: true })],
      }
      const { css }: { css: string } = await less.render(input + str, options)
      res.send(css)
    } catch (err) {
      res.status(500).send(err.message)
      console.log(err)
    }
  })
  app.listen(config.port, () =>
    console.log(`Server is listening on port ${config.port}!`)
  )
}

service()
