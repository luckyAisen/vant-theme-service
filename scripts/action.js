import { updateVantSouce, updateVantIconPath } from './utils.js'

async function action() {
  try {
    await updateVantSouce()
    // await updateVantIconPath()
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

action()
