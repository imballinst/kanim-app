// const { winstonInfo } = require('../lib/logging');
const { getOfficeQuota } = require('../lib/quota');
const { parseJSONIfString } = require('../lib/objectUtil');
const {
  checkSession, getOffices, getAvailability, getQuotaInfo,
} = require('../lib/request');

module.exports = (app) => {
  app.get('/offices', (req, res) => {
    const token = req.headers['x-imm-token'];
    const response = { success: false };

    if (!token) {
      response.message = 'Please provide token!';
      res.send(response);
    } else {
      checkSession(undefined, token)
        .then(({ data }) => {
          const { Success, Message } = parseJSONIfString(data);

          if (Success) {
            return getOffices();
          }

          return { data: { Message, errorCode: 401 } };
        })
        .then(({ data }) => {
          const {
            Success, Message, Offices, errorCode,
          } = parseJSONIfString(data);

          res.set('Content-Type', 'application/json');

          if (!Message || Success) {
            response.data = Offices;
            response.success = true;
          } else {
            response.message = Message;
            response.errorCode = errorCode;
          }

          res.send(response);
        })
        .catch(({ message }) => res.send({ success: false, message }));
    }
  });

  app.get('/offices/:officeID', (req, res) => {
    // get quota for an office
    const token = req.headers['x-imm-token'];
    const { startDate, endDate } = req.query;
    const response = { success: false };

    res.set('Content-Type', 'application/json');

    if (!token) {
      response.message = 'Please provide token!';
      res.send(response);
    } else {
      checkSession(undefined, token)
        .then(({ data }) => {
          const { Success, Message } = parseJSONIfString(data);

          if (Success) {
            return getAvailability(undefined, token, req.params.officeID, startDate, endDate);
          }
          return { data: { Message, errorCode: 401 } };
        })
        .then(({ data }) => {
          const {
            Success, Message, Availability, errorCode,
          } = parseJSONIfString(data);

          if (!Message || Success) {
            const quota = getOfficeQuota(Availability, startDate, endDate);

            response.data = quota;
            response.success = true;
          } else {
            response.message = Message;
            response.errorCode = errorCode;
          }

          res.send(response);
        })
        .catch(({ message }) => res.send({ success: false, message }));
    }
  });

  app.post('/offices/:officeID/check', (req, res) => {
    // get quota for an office
    const token = req.headers['x-imm-token'];
    const { date, startHour, endHour } = req.body;
    const response = { success: false };

    res.set('Content-Type', 'application/json');

    if (!token) {
      response.message = 'Please provide token!';
      res.send(response);
    } else {
      checkSession(undefined, token)
        .then(({ data }) => {
          const { Success, Message, jumlah } = parseJSONIfString(data);

          if (Success && jumlah < 5) {
            return getQuotaInfo(undefined, token, req.params.officeID, date, startHour, endHour);
          } else if (Success && jumlah === 5) {
            return { data: { Message: 'Kuota habis', errorCode: 400 } };
          }

          return { data: { Message, errorCode: 401 } };
        })
        .then(({ data }) => {
          const {
            Message, QUOTA, DetailTimingId, Success, errorCode,
          } = parseJSONIfString(data);

          if (!Message || Success) {
            response.data = {
              quota: QUOTA,
              timingID: DetailTimingId,
            };
            response.success = true;
          } else {
            response.message = Message;
            response.errorCode = errorCode;
          }

          res.send(response);
        })
        .catch(({ message }) => res.send({ success: false, message }));
    }
  });
};
