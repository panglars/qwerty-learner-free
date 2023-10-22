const csvFilePath = process.argv[2]
const jsonFilePath = process.argv[3]

const csv = require('csv-parser')
const fs = require('fs')
var removeBOM = require('remove-bom-stream')

const jsonArray = []

if (!jsonFilePath) {
  throw new Error('Please provide the CSV and Json file path as a command line argument.')
}

fs.createReadStream(csvFilePath)
  .pipe(removeBOM('utf-8'))
  .pipe(csv())
  .on('data', (data) => {
    const item = {
      name: data.word,
      trans: [data.translation],
      usphone: data.phonetic,
    }
    jsonArray.push(item)
  })
  .on('end', () => {
    const jsonContent = JSON.stringify(jsonArray, null, 2)
    fs.writeFile('public/dicts/' + jsonFilePath + '.json', jsonContent, 'utf8', (err) => {
      if (err) {
        console.error('An error occurred while writing the JSON file:', err)
        return
      }
      console.log('JSON file has been successfully created!')
    })
  })
