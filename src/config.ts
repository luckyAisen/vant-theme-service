import { Config, Version, DirPath } from './interface'

const CWD = process.cwd()

const version: Version = {
  '2.x': 'https://registry.npmjs.org/vant/-/vant-2.12.18.tgz',
  '3.x': 'https://registry.npmjs.org/vant/-/vant-3.0.16.tgz',
}

const dirPath: DirPath = {
  vantDir: `${CWD}/vant`,
  styleDir: `${CWD}/styles`,
}

const config: Config = {
  port: 5000,
  cwd: CWD,
  version,
  dirPath,
  exclude: ['style', 'utils'],
  targetFile: ['var.less', 'index.less'],
}

export default config
