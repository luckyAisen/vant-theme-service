const {
  LOCAL_SOURCE,
  pathExists,
  updateVantSouce,
  runServe
} = require('./utils')

async function serve() {
  try {
    if (!(await pathExists(LOCAL_SOURCE))) {
      await updateVantSouce()
    }
    runServe()
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

serve()
