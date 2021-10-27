import { spawn } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { pathExists, copy, remove } from 'fs-extra'
import puppeteer from 'puppeteer'
import urllib from 'urllib'
import compressing from 'compressing'
import { logWithSpinner, successSpinner, failSpinner } from './spinner.js'

export const VANT_URL = `https://www.jsdelivr.com/package/npm/vant`
export const LOCAL_SOURCE = 'static/vant'

/**
 * 判断文件是否存在
 * @param {String} path 文件路径
 * @returns {Boolean}
 */
export async function isExists(path) {
  logWithSpinner(`check ${path} is exists?`)
  const exists = await pathExists(`${path}`)
  if (exists) {
    successSpinner(`${path} is exists`)
  } else {
    failSpinner(`${path} no exists`)
  }
  return exists
}

/**
 * 下载 vant 编译后的代码
 */
export async function updateVantSouce() {
  try {
    logWithSpinner('download vant source')
    const browser = await puppeteer.launch({
      // headless: false
    })
    const page = await browser.newPage()
    await page.goto(VANT_URL, {
      waitUntil: 'networkidle2'
    })
    const sourceUrl = await page.evaluate(() => {
      return document
        .querySelector(".package-buttons a[title='Download']")
        .getAttribute('href')
    })
    const { res } = await urllib.request(sourceUrl, {
      streaming: true,
      followRedirect: true
    })
    await compressing.tgz.uncompress(res, LOCAL_SOURCE)
    await browser.close()
    successSpinner('download success')
  } catch (err) {
    failSpinner('download fail, check your network')
    throw new Error(err)
  }
}

/**
 * 修改 icon 引入路劲
 */
export async function updateVantIconPath() {
  try {
    logWithSpinner('update vant icon path')

    const src = 'node_modules/@vant/icons/src'
    const destPrefix = `${LOCAL_SOURCE}/package/lib/icon/`
    const newFileName = 'vant-icons'
    const dest = `${destPrefix}${newFileName}`
    await copy(src, dest)
    const targetFile = `${destPrefix}/index.less`
    const lessContent = readFileSync(targetFile, 'UTF-8')
    const newLessContent = lessContent.replace(
      new RegExp('~@vant/icons/src/', 'g'),
      './vant-icons/'
    )
    writeFileSync(targetFile, newLessContent)
    successSpinner('update success')
  } catch (err) {
    successSpinner('update failed')
    throw new Error(err)
  }
}

export function runServe() {
  spawn('npx', ['vercel dev --debug'], { stdio: 'inherit', shell: true })
}

export function runBuild() {
  spawn('npx', ['vercel --prod'], { stdio: 'inherit', shell: true })
}

export async function runClean() {
  return remove(LOCAL_SOURCE)
}
