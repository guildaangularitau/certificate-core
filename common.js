const fs = require('fs')
const path = require('path')
const pdf = require('html-pdf')
const renderer = require('ejs')

function createFile (fileName, htmlContent, baseFolder) {
  console.log(`Creating PDF file: ${fileName}.pdf at ${path.resolve(baseFolder, `${fileName}.pdf`)}`)
  return new Promise((resolve, reject) => {
    pdf
      .create(htmlContent, { height: '4.308in', width: '9in',timeout: 900000 })
      .toFile(path.resolve(baseFolder, `${fileName}.pdf`), (err, file) => {
        if (err) reject(err)
        resolve(file)
      })
  })
}

function createBaseDirectory (baseFolder) {
  if (!fs.existsSync(path.resolve(baseFolder))) return fs.mkdirSync(baseFolder, { recursive: true })
}

function renderTemplate (template, data) {
  console.log('Rendering template with data', data)
  return renderer.render(template, data)
}

module.exports = {
  createFile,
  createBaseDirectory,
  renderTemplate
}