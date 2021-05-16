import fs from 'fs-extra'
import path from 'path'
import del from 'del'

export function parseTime(
  time?: Date | string | number | null,
  cFormat?: string
): string | null {
  if (time === undefined || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date: Date
  if (typeof time === 'object') {
    date = time as Date
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(/-/gm, '/')
      }
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: { [key: string]: number } = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const timeStr = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return timeStr
}

/**
 * 拼接路径
 * @param rest 路径
 * @returns 拼接后的路径
 */
export function concatPath(...rest: string[]): string {
  return path.join(rest.join('/'))
}

/**
 * 删除指定文件
 * @param targetPath 目标路径地址数组
 * @returns promise
 */
export async function cleanTargetDirectory(
  targetPath: Array<string>
): Promise<unknown> {
  return await del(targetPath)
}

/**
 * 复制文件
 * @param path 源文件路径
 * @param dist 目标文件路径
 */
export function copyFile(path: string, dist: string): Promise<void> {
  return fs.copy(path, dist)
}

/**
 * 重写文件内容
 * @param pathPrefix 文件前缀
 * @param path 相对路径
 * @param reg 正则表达式
 * @param context 替换内容
 */
export async function reWriteFile(
  pathPrefix: string,
  path: string,
  reg: RegExp,
  context: string
): Promise<void> {
  const dir = concatPath(pathPrefix, path)
  const input = fs.readFileSync(dir, 'utf8')
  const output = input.replace(reg, context)
  fs.writeFileSync(dir, output, 'utf8')
}
