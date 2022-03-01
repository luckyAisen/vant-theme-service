import {
  LOCAL_SOURCE,
  isExists,
  updateVantSouce,
  replaceIndexIcon,
  runServe
} from './utils.js'

async function serve() {
  try {
    if (!(await isExists(LOCAL_SOURCE))) {
      await updateVantSouce()
      await replaceIndexIcon()
    }
    runServe()
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

serve()
