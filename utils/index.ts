import { resolve } from 'path'
import fs from 'fs-extra'
export * from './constant'

export function pathResolve(path: string): string {
  return resolve(process.cwd(), path)
}

export async function readFileReturnString(filePath: string) {
  const localPath = pathResolve(filePath)
  const fileContent = fs.readFileSync(localPath, 'utf8')
  return fileContent
}
