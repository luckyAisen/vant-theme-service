import { VercelRequest, VercelResponse } from '@vercel/node'
import {
  VANT_URL,
  LOCAL_SOURCE,
  pathResolve,
  del,
  download,
  compress
} from '../utils/index'

async function clean() {
  del(LOCAL_SOURCE)
}

async function downloadSource() {
  const { res } = await download(VANT_URL)
  const localPath = pathResolve(LOCAL_SOURCE)
  await compress(res, localPath)
}

module.exports = async (req: VercelRequest, res: VercelResponse) => {
  await clean()
  await downloadSource()
  res.send('update vant souce success')
}
