import { updateVantSouce, replaceIndexIcon, runBuild } from './utils.js'

async function build() {
  try {
    await updateVantSouce()
    await replaceIndexIcon()
    runBuild()
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

build()
