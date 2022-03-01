import { updateVantSouce, replaceIndexIcon } from './utils.js'

async function action() {
  try {
    await updateVantSouce()
    await replaceIndexIcon()
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

action()
