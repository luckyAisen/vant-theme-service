import { resolve } from 'path'
export * from './constant'

export function pathResolve(path: string): string {
  return resolve(process.cwd(), path)
}
