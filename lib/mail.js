const sgMail = require('@sendgrid/mail');
const { formatDate } = require('./dateUtil');
const { SENDGRID_API_KEY } = require('../config/env');

// Set API key
sgMail.setApiKey(SENDGRID_API_KEY);

const buildMail = (officeName, quotaObjectArray) => {
  const { length } = quotaObjectArray;
  let text;
  let html;

  if (length > 1) {
    text = `Halo! ${officeName} untuk tanggal`;
    html = `Halo!<br><br><b>${officeName}</b> untuk tanggal: <ol>`;

    quotaObjectArray.forEach(({ date, morning, afternoon }, idx) => {
      const formattedDate = formatDate(date);

      text += ` ${idx + 1}. ${formattedDate} (pagi: ${morning} orang, siang: ${afternoon} orang)`;
      html += `<li>${formattedDate} (pagi: ${morning} orang, siang: ${afternoon} orang)</li>`;

      if (idx + 1 === length) {
        text += '.';
        html += '</ol><br>';
      } else {
        text += ',';
      }
    });
  } else {
    const { date, morning, afternoon } = quotaObjectArray[0];
    const formattedDate = formatDate(date);

    text = `Halo! ${officeName} untuk tanggal ${formattedDate} saat ini terbuka` +
      ` dengan kuota pagi ${morning} orang dan kuota siang ${afternoon} orang.`;
    html = `Halo!<br><br><b>${officeName}</b> untuk tanggal <b>${formattedDate}</b>` +
      ` saat ini terbuka dengan kuota pagi <b>${morning}</b> orang dan kuota siang` +
      ` ${afternoon} orang.`;
  }

  return {
    subject: `Notifikasi Kuota Kanim ${officeName}`,
    text,
    html,
  };
};

const sendMail = (recipient, officeName, quotaObjectArray) => {
  const msg = Object.assign({
    to: recipient,
    from: 'kanim.service@imballinst.com',
  }, buildMail(officeName, quotaObjectArray));

  sgMail.send(msg);
};

module.exports = { buildMail, sendMail };
