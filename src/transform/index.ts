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
import { concatPath, cleanTargetDirectory, copyFile } from '../utils'

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
    console.log('vantDir:', this.vantDir)
    console.log('vantLibDir:', this.vantLibDir)
    console.log('styleDir:', this.styleDir)
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
    // 处理组件
    await this.handleComponent()
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
   * 复制组件目录
   */
  async handleComponent(): Promise<void> {
    const fileList = fs.readdirSync(this.vantLibDir)
    fileList.forEach(async fileName => {
      // 当前文件夹路径
      const currentPath = concatPath(this.vantLibDir, fileName)
      // 如果当前是文件夹
      if (
        fs.statSync(currentPath).isDirectory() &&
        !config.exclude.includes(fileName)
      ) {
        // 组件目录地址
        const componentPath = concatPath(this.styleDir, fileName)
        // 创建组件目录
        await fs.ensureDir(componentPath)
        await this.targetFile.forEach(async target => {
          // target  目标路径
          const targetPath = concatPath(currentPath, target)
          console.log(targetPath)
          if (await fs.pathExists(targetPath)) {
            const targetIndexPath = concatPath(componentPath, target)
            await copyFile(targetPath, targetIndexPath)
          }
        })
      }
    })
  }
}
