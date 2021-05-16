/**
 * 1、清除指定目录
 * 2、新建目录
 * 3、下载，解压
 * 4、处理文件的转换
 */
import fs from 'fs-extra'
import urllib from 'urllib'
import compressing from 'compressing'
import { Version } from '../interface'
import config from '../config'
import {
  concatPath,
  cleanTargetDirectory,
  copyFile,
  reWriteFile,
} from '../utils'

export default class Transform {
  // 版本号
  readonly version: string
  // 源码路径
  readonly vantDir: string
  // 源码lib路径
  readonly vantLibDir: string
  // 处理后的源码路径
  readonly styleDir: string
  // 目标目录
  readonly targetFile: string[]

  constructor(version: string) {
    this.version = version
    this.vantDir = concatPath(config.dirPath.vantDir, version)
    this.vantLibDir = concatPath(this.vantDir, '/package/lib')
    this.styleDir = concatPath(config.dirPath.styleDir, version)
    this.targetFile = config.targetFile
    // console.log('vantDir:', this.vantDir)
    // console.log('vantLibDir:', this.vantLibDir)
    // console.log('styleDir:', this.styleDir)
    this.handle()
  }

  async handle(): Promise<void> {
    // 1、清除指定目录
    await this.handleClean([this.vantDir, this.styleDir])
    // 2、新建目录
    await this.handleCreateDir()
    // 3、下载，解压
    await this.handleDownload()
    // 4、拷贝文件
    await this.handleTransform()
  }

  /**
   * 清除源码目录和css样式目录
   * @param targetDir 目标路径地址数组
   * @returns Promise
   */
  async handleClean(targetDir: string[]): Promise<unknown> {
    return cleanTargetDirectory(targetDir)
  }

  /**
   * 创建目录
   * @param vantDir 源码路径
   * @param styleDir  处理后的源码路径
   */
  async handleCreateDir(): Promise<void> {
    await fs.ensureDir(this.vantDir)
    await fs.ensureDir(this.styleDir)
  }

  /**
   * 处理源码的下载
   * @param version 版本号
   */
  async handleDownload(): Promise<void> {
    const result = await urllib.request(
      config.version[this.version as keyof Version],
      {
        streaming: true,
        followRedirect: true,
      }
    )
    await compressing.tgz.uncompress(
      (result.res as unknown) as never,
      this.vantDir
    )
  }

  /**
   * 4、处理文件的转换
   */
  async handleTransform(): Promise<void> {
    // 复制基本的文件
    await this.handleCopyBaseFile()
    // 替换 index.less 路径替换
    await this.handleChangeIndexLessPrefix()
    // 处理组件
    this.handleComponent()
  }

  /**
   * 复制 style 文件夹和根目录下的 index.less 文件
   */
  async handleCopyBaseFile(): Promise<void> {
    await copyFile(
      concatPath(this.vantLibDir, '/index.less'),
      concatPath(this.styleDir, '/index.less')
    )

    await copyFile(
      concatPath(this.vantLibDir, 'style'),
      concatPath(this.styleDir, 'style')
    )
  }

  /**
   * 把转换后的 index.less 中的所有的 ./ 替换成绝对路径
   */
  async handleChangeIndexLessPrefix(): Promise<void> {
    // /**
    //  * 1、读取文件内容
    //  * 2、把 ./ 替换成 config.cwd/styles/3.x/
    //  * 3、覆盖文件内容
    //  */
    // // 转换后的 index.less 路径
    // const indexLessDir = concatPath(this.styleDir, '/index.less')
    // // 读取文件内容
    // const input = fs.readFileSync(indexLessDir, 'utf8')
    // // 把 ./ 替换成 config.cwd/styles/3.x/
    // const output = input.replace(/\.\//g, `${this.styleDir}/`)
    // // 写入文件
    // fs.writeFileSync(indexLessDir, output, 'utf8')

    reWriteFile(this.styleDir, '/index.less', /\.\//g, `${this.styleDir}/`)
  }

  /**
   * 把转换后的 icon 中的字体路径替换为绝对路径
   */
  async handleChangeIconLessPrefix(): Promise<void> {
    // /**
    //  * 1、读取文件内容
    //  * 2、把 ./ 替换成 config.cwd/styles/3.x/
    //  * 3、覆盖文件内容
    //  */
    // // 转换后的 index.less 路径
    // const iconLessDir = concatPath(this.styleDir, '/icon/index.less')
    // // 读取文件内容
    // const input = fs.readFileSync(iconLessDir, 'utf8')
    // // 把 ~ 替换成 config.cwd/styles/3.x/
    // const output = input.replace(/~/g, `${config.cwd}/node_modules/`)
    // // 写入文件
    // fs.writeFileSync(iconLessDir, output, 'utf8')

    reWriteFile(
      this.styleDir,
      '/icon/index.less',
      /~/g,
      `${config.cwd}/node_modules/`
    )
  }

  /**
   * 复制组件目录
   */
  handleComponent(): void {
    const fileList = fs.readdirSync(this.vantLibDir)
    fileList.forEach(async dirName => {
      // 当前文件夹路径
      const currentPath = concatPath(this.vantLibDir, dirName)
      // 如果当前是文件夹
      if (
        fs.statSync(currentPath).isDirectory() &&
        !config.exclude.includes(dirName)
      ) {
        // 组件目录地址
        const componentPath = concatPath(this.styleDir, dirName)
        // 创建组件目录
        await fs.ensureDir(componentPath)
        await this.targetFile.forEach(async target => {
          // target  目标路径
          const targetPath = concatPath(currentPath, target)
          console.log(targetPath)
          if (await fs.pathExists(targetPath)) {
            const targetIndexPath = concatPath(componentPath, target)
            await copyFile(targetPath, targetIndexPath)
            if (dirName === 'icon') {
              // 替换 icon 中的字体路径问题
              this.handleChangeIconLessPrefix()
            }
          }
        })
      }
    })
  }
}
