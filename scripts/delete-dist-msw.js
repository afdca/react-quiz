import { unlink } from "fs/promises"

const path = "./dist/mockServiceWorker.js"

try {
  await unlink(path)
  console.info(`Successfully deleted ${path}`)
} catch (err) {
  if (err && err.code == "ENOENT") {
    console.error(`Error occurred while trying to remove ${path}: file does not exist`)
  } else if (err) {
    console.error(`Error occurred while trying to remove ${path}`)
  }
  throw err
}
