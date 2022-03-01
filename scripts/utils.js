import { spawn } from 'child_process'
import { resolve } from 'path'
import fs from 'fs-extra'
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
  logWithSpinner(`check ${path} is exists start`)
  const exists = await fs.pathExists(`${path}`)
  if (exists) {
    successSpinner(`${path} is exists complete`)
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
    logWithSpinner('download vant source start')
    const browser = await puppeteer.launch({
      // headless: false
    })
    const page = await browser.newPage()
    await page.goto(VANT_URL, {
      waitUntil: 'networkidle2'
    })
    const version = await page.evaluate(async () => {
      const tag = document
        .querySelector('.dropdown-menu.dropdown-menu-right')
        .querySelectorAll('a')
      let tagList = Array.from(tag)
      let version = '2.12.44'
      for (let i = 0; i < tagList.length; i++) {
        if (tagList[i][0] === '2') {
          version = tagList[i]
          break
        }
      }
      return version
    })
    await page.goto(`${VANT_URL}?version=${version}`, {
      waitUntil: 'networkidle2'
    })
    const sourceUrl = await page.evaluate(async () => {
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
    successSpinner('download vant source complete')
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
    logWithSpinner('update vant icon path start')
    const src = 'node_modules/@vant/icons/src'
    const destPrefix = `${LOCAL_SOURCE}/package/lib/icon/`
    const newFileName = 'vant-icons'
    const dest = `${destPrefix}${newFileName}`
    await fs.copy(src, dest)
    const targetFile = `${destPrefix}/index.less`
    const lessContent = fs.readFileSync(targetFile, 'UTF-8')
    const newLessContent = lessContent.replace(
      new RegExp('~@vant/icons/src/', 'g'),
      './vant-icons/'
    )
    await fs.outputFile(targetFile, newLessContent)
    successSpinner('update vant icon path start complete')
  } catch (err) {
    successSpinner('update vant icon path start failed')
    throw new Error(err)
  }
}

/**
 * 注释 icon 路径
 */
export async function replaceIndexIcon() {
  logWithSpinner(`replace index.less icon start`)
  const targetFile = resolve(
    process.env.PWD,
    'static/vant/package/lib/index.less'
  )
  fs.readFile(targetFile, (err, buffer) => {
    if (err) console.error(err)
    const newContent = buffer
      .toString()
      .replace(
        new RegExp('@import "./icon/index.less"', 'g'),
        '// @import "./icon/index.less";'
      )
    fs.outputFile(targetFile, newContent)
  })
  successSpinner(`replace index.less icon completed`)
}

export function runServe() {
  spawn('npx', ['vercel dev --debug'], { stdio: 'inherit', shell: true })
}

export function runBuild() {
  spawn('npx', ['vercel --prod'], { stdio: 'inherit', shell: true })
}

export async function runClean() {
  return fs.remove(LOCAL_SOURCE)
}
