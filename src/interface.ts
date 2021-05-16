export interface Version {
  '2.x': string
  '3.x': string
}

export interface DirPath {
  cwd?: string
  vantDir: string
  styleDir: string
}

export interface Config {
  cwd: string
  version: Version
  dirPath: DirPath
  exclude: string[]
  targetFile: string[]
}
