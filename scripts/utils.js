const { spawn } = require('child_process')
const fs = require('fs-extra')
const puppeteer = require('puppeteer')
const urllib = require('urllib')
const compressing = require('compressing')
const VANT_URL = `https://www.jsdelivr.com/package/npm/vant`
const LOCAL_SOURCE = 'static/vant'
const { logWithSpinner, successSpinner, failSpinner } = require('./spinner')

/**
 * 判断文件是否存在
 * @param {String} path 文件路径
 * @returns {Boolean}
 */
async function pathExists(path) {
  logWithSpinner(`check ${path} is exists?`)
  const exists = await fs.pathExists(`${path}`)
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
async function updateVantSouce() {
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
async function updateVantIconPath() {
  try {
    logWithSpinner('update vant icon path')

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
    await fs.writeFile(targetFile, newLessContent)
    successSpinner('update success')
  } catch (err) {
    successSpinner('update failed')
    throw new Error(err)
  }
}

function runServe() {
  spawn('npx', ['vercel dev --debug'], { stdio: 'inherit', shell: true })
}

function runBuild() {
  spawn('npx', ['vercel --prod'], { stdio: 'inherit', shell: true })
}

async function runClean() {
  return fs.remove(LOCAL_SOURCE)
}

module.exports = {
  VANT_URL,
  LOCAL_SOURCE,
  pathExists,
  updateVantSouce,
  updateVantIconPath,
  runServe,
  runBuild,
  runClean
}
