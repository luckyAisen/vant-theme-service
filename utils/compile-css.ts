import postcss from 'postcss'
// import postcssrc from 'postcss-load-config'
import CleanCss from 'clean-css'

const cleanCss = new CleanCss()

export async function compileCss(source: string | Buffer) {
  // const config = await postcssrc({})
  // const { css } = await postcss(config.plugins as any).process(source, {
  //   from: undefined
  // })
  const { css } = await postcss().process(source, {
    from: undefined
  })
  return cleanCss.minify(css).styles
}
