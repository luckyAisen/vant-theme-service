import { compileCss } from './compile-css'
import { compileLess } from './compile-less'

export async function compileStyle(filePath: string, customCss: string) {
  try {
    const source = await compileLess(filePath, customCss)
    return await compileCss(source)
  } catch (err) {
    console.error('Compile style failed: ' + filePath)
    throw err
  }
}
