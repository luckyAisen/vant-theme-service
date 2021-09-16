import { render, FileManager } from 'less'

// less plugin to resolve tilde
class TildeResolver extends FileManager {
  loadFile(filename: string, ...args: any[]) {
    filename = filename.replace('~', '')
    return FileManager.prototype.loadFile.apply(this, [filename, ...args])
  }
}

const TildeResolverPlugin = {
  install(lessInstance: unknown, pluginManager: any) {
    pluginManager.addFileManager(new TildeResolver())
  }
}

export async function compileLess(source: string, filePath: string) {
  const { css } = await render(source, {
    filename: filePath,
    plugins: [TildeResolverPlugin]
  })

  return css
}
