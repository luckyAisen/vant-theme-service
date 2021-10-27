import { updateVantSouce, updateVantIconPath, runBuild } from './utils.js'

async function build() {
  try {
    await updateVantSouce()
    await updateVantIconPath()
    runBuild()
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

build()
