import { VercelRequest, VercelResponse } from '@vercel/node'
module.exports = async (req: VercelRequest, res: VercelResponse) => {
  const data = {
    msg: 'test'
  }
  res.status(200).json(data)
}
