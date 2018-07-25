const sgMail = require('@sendgrid/mail');
const { formatDate } = require('./dateUtil');
const { SENDGRID_API_KEY } = require('../config/env');

// Set API key
sgMail.setApiKey(SENDGRID_API_KEY);

const buildMail = (officeName, quotaObjectArray) => {
  const { length } = quotaObjectArray;
  const endingWords = 'Semoga lancar ya proses pengurusan paspornya!';
  let text;
  let html;

  if (length > 1) {
    text = `Halo! Telah tersedia kuota untuk ${officeName} pada tanggal`;
    html = `Halo!<br><br>Telah tersedia kuota untuk <b>${officeName}</b> pada tanggal: <ol>`;

    quotaObjectArray.forEach(({ date, morning, afternoon }, idx) => {
      const formattedDate = formatDate(date);

      text += ` ${idx + 1}. ${formattedDate} (pagi: ${morning} orang, siang: ${afternoon} orang)`;
      html += `<li>${formattedDate} (pagi: ${morning} orang, siang: ${afternoon} orang)</li>`;

      if (idx + 1 === length) {
        text += '. ';
        html += '</ol><br>';
      } else {
        text += ',';
      }
    });
  } else {
    const { date, morning, afternoon } = quotaObjectArray[0];
    const formattedDate = formatDate(date);

    text = `Halo! Telah tersedia kuota untuk ${officeName} pada tanggal ${formattedDate}` +
      ` dengan kuota pagi ${morning} orang dan kuota siang ${afternoon} orang. `;
    html = `Halo!<br><br>Telah tersedia kuota untuk <b>${officeName}</b> pada tanggal` +
      ` <b>${formattedDate}</b> dengan kuota pagi <b>${morning}</b> orang` +
      ` dan kuota siang ${afternoon} orang.<br>`;
  }

  text += endingWords;
  html += endingWords;

  return {
    subject: `Notifikasi Kuota Kanim ${officeName}`,
    text,
    html,
  };
};

const sendMail = (recipient, dbID, officeName, quotaObjectArray) => {
  const msg = Object.assign({
    to: recipient,
    from: 'noreply.kanim@imballinst.com',
  }, buildMail(officeName, quotaObjectArray));

  return sgMail
    .send(msg)
    .then(response => Object.assign(response[0].toJSON(), { dbID }));
};

module.exports = { buildMail, sendMail };
