import { resolve } from 'path'
import fs from 'fs-extra'
import urllib from 'urllib'
import compressing from 'compressing'
export * from './constant'

export function pathResolve(path: string): string {
  return resolve(process.cwd(), path)
}

export async function del(path: string): Promise<void> {
  return fs.remove(path)
}

export async function download(source: string) {
  return urllib.request(source, {
    streaming: true,
    followRedirect: true
  })
}

export async function compress(result, output: string) {
  await compressing.tgz.uncompress(result, output)
}

export async function readFileReturnString(filePath: string) {
  const localPath = pathResolve(filePath)
  const fileContent = fs.readFileSync(localPath, 'utf8')
  return fileContent
}
