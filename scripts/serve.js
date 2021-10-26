const {
  LOCAL_SOURCE,
  pathExists,
  updateVantSouce,
  updateVantIconPath,
  runServe
} = require('./utils')

async function serve() {
  try {
    if (!(await pathExists(LOCAL_SOURCE))) {
      await updateVantSouce()
      await updateVantIconPath()
    }
    runServe()
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

serve()
