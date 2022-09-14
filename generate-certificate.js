const fs = require('fs')
const moment = require('moment')
const args = require('yargs').argv;
const csv = require('csv-parser');
const toCase = require('change-case')
const template = fs.readFileSync('./templates/TemplateCertificate.ejs').toString()
const { createBaseDirectory, createFile, renderTemplate } = require('./common')

moment.locale('pt');

const file = args.file
const baseDir = args.baseDir

async function createCertificate (row) {
  const data = {
    event: {
      name: toCase.titleCase(row.eventName),
      date: row.date,
      hours: row.hours,
      id: row.eventId
    },
    user: {
      name: toCase.titleCase(row.userName),
      email: row.email
    }
  }

  data.event.date = moment(data.event.date).format('DD [de] MMMM [de] YYYY')
  data.event.date = toCase.titleCase(data.event.date)

  createFile(`${data.user.email}`, renderTemplate(template, data), baseDir).then(() => console.log(`File ${data.event.name} created`))
}

createBaseDirectory(baseDir)
fs.createReadStream(file)
  .pipe(csv())
  .on('data', async (row) => {
    await createCertificate(row)
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });   