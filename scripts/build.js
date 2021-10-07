const { updateVantSouce, runBuild } = require('./utils')

async function build() {
  try {
    await updateVantSouce()
    runBuild()
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

build()
