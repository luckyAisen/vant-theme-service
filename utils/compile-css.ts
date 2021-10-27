import postcss from 'postcss'
import CleanCss from 'clean-css'

const cleanCss = new CleanCss()

export async function compileCss(source: string | Buffer) {
  const { css } = await postcss().process(source, {
    from: undefined
  })
  return cleanCss.minify(css).styles
}
