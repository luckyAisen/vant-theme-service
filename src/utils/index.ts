/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import fs from 'fs'

/**
 * Parse the time to string
 * @param {(Date|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(
  time: Date | number | string,
  cFormat = '{y}-{m}-{d} {h}:{i}:{s}'
): string | number | Date | null {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: any = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}

export function fileReadStream(path: string) {
  const fileReadStream = fs.createReadStream(path)
  let stream: any
  return fileReadStream.on('data', async (chunk: Buffer) => {
    stream = chunk
    return stream
  })
}

export function streamToString(stream: any): any {
  const chunks: any = []
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: any) => chunks.push(Buffer.from(chunk)))
    stream.on('error', (err: any) => reject(err))
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}
