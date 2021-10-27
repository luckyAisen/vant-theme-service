import ora from 'ora'

const spinner = ora()

export function logWithSpinner(msg) {
  spinner.text = msg
  spinner.start()
}

export function successSpinner(text) {
  spinner.succeed(text)
}

export function failSpinner(text) {
  spinner.fail(text)
}

export function stopSpinner(text) {
  spinner.stop(text)
}
