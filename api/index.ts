import { VercelRequest, VercelResponse } from '@vercel/node'

module.exports = async (req: VercelRequest, res: VercelResponse) => {
  const msg = `
  Hello Vercel Api! 可以白嫖啦，Vercel 居然支持 nodejs python 等服务的托管。<br />
  可以返回 json 类型的数据格式哦，点击试试吧：<a href="/json">/json</a>
  `
  res.send(msg)
}
