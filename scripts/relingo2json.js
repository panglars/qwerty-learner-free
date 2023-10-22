const csvFilePath = process.argv[2] // 获取命令行参数中的文件路径
const csv = require('csv-parser')
const fs = require('fs')
var removeBOM = require('remove-bom-stream')

const jsonArray = []

fs.createReadStream(csvFilePath)
  .pipe(removeBOM('utf-8'))
  .pipe(csv())
  .on('data', (data) => {
    const item = {
      name: data.word,
      trans: [data.translation],
    }
    jsonArray.push(item)
  })
  .on('end', () => {
    const jsonContent = JSON.stringify(jsonArray, null, 2)
    fs.writeFile('public/dicts/PangLAN.json', jsonContent, 'utf8', (err) => {
      if (err) {
        console.error('An error occurred while writing the JSON file:', err)
        return
      }
      console.log('JSON file has been successfully created!')
    })
  })
