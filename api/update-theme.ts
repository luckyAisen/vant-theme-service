import { VercelRequest, VercelResponse } from '@vercel/node'
import { MAIN_LESS, readFileReturnString } from '../utils/index'
import { compileLess } from '../utils/compile-less'

type DefineVar = {
  [propName: string]: string
}

async function getMainLessContent(): Promise<string> {
  const lessContent = await readFileReturnString(MAIN_LESS)
  return `${lessContent}\n\n// user define content start\n\n`
}

function appendUserDefineContent(arr: DefineVar[]): string {
  let userDefineContent = ''
  arr.forEach(item => {
    userDefineContent += getUserVar(item)
  })
  return userDefineContent
}

function getUserVar(defineVar: DefineVar): string {
  let text = ''
  for (const key in defineVar) {
    text += `${key}: ${defineVar[key]}; `
  }
  return text
}

module.exports = async (req: VercelRequest, res: VercelResponse) => {
  const { global = {}, local = {} } = req.body || {}
  const mainLess = await getMainLessContent()
  const defineLess = appendUserDefineContent([global, local])
  const beforeCompileCss = mainLess + defineLess
  try {
    const css = await compileLess(beforeCompileCss, MAIN_LESS)
    res.send(css)
  } catch (err) {
    console.log(err)
    res.send(err).status(500)
  }
}
