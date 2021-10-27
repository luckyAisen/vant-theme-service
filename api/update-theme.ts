import { VercelRequest, VercelResponse } from '@vercel/node'
import { MAIN_LESS } from '../utils/index'
import { compileStyle } from '../utils/compile-style'

type DefineVar = {
  [propName: string]: string
}

function getUserVar(defineVar: DefineVar): string {
  let text = `\n\n// user define content start\n\n`
  for (const key in defineVar) {
    text += `${key}: ${defineVar[key]}; `
  }
  return text
}

module.exports = async (req: VercelRequest, res: VercelResponse) => {
  const cssParams = req.body || {}
  const customCss = getUserVar(cssParams)
  try {
    const css = await compileStyle(MAIN_LESS, customCss)
    res.send(css)
  } catch (err) {
    console.log(err)
    res.send(err).status(500)
  }
}
