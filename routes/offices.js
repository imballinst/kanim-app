// const { winstonInfo } = require('../lib/logging');
const { getOfficeQuota } = require('../lib/quota');
const { parseJSONIfString } = require('../lib/objectUtil');
const {
  postCheckSession,
  postListKanim,
  postAvailabilityInfo,
  postQuotaInfo,
  postRegisterQueue,
} = require('../lib/request');

module.exports = (app) => {
  app.get('/offices', (req, res) => {
    const token = req.headers['x-imm-token'];
    const response = { success: false };

    if (!token) {
      response.message = 'Please provide token!';
      res.send(response);
    } else {
      postCheckSession(undefined, token).then(({ data }) => {
        const { Success, Message } = parseJSONIfString(data);

        if (Success) {
          return postListKanim();
        }

        return { data: { Message, errorCode: 401 } };
      }).then(({ data }) => {
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
      }).catch(err => res.send({
        success: false,
        message: err,
      }));
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
      postCheckSession(undefined, token).then(({ data }) => {
        const { Success, Message } = parseJSONIfString(data);

        if (Success) {
          return postAvailabilityInfo(undefined, token, req.params.officeID, startDate, endDate);
        }
        return { data: { Message, errorCode: 401 } };
      }).then(({ data }) => {
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
      }).catch(err => res.send({
        success: false,
        message: err,
      }));
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
      postCheckSession(undefined, token).then(({ data }) => {
        const { Success, Message, jumlah } = parseJSONIfString(data);

        if (Success && jumlah < 5) {
          return postQuotaInfo(undefined, token, req.params.officeID, date, startHour, endHour);
        } else if (Success && jumlah === 5) {
          return { data: { Message: 'Kuota habis', errorCode: 400 }};
        }

        return { data: { Message, errorCode: 401 } };
      }).then(({ data }) => {
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
      }).catch(err => res.send({
        success: false,
        message: err,
      }));
    }
  });

  app.post('/offices/:officeID/register', (req, res) => {
    // get quota for an office
    const token = req.headers['x-imm-token'];
    const {
      applicantCount, userID, timingID, name, nik,
    } = req.body;
    const response = { success: false };

    res.set('Content-Type', 'application/json');

    if (!token) {
      response.message = 'Please provide token!';
      res.send(response);
    } else {
      postCheckSession(undefined, token).then(({ data }) => {
        const { Success, Message, jumlah } = parseJSONIfString(data);

        if (Success && jumlah < 5) {
          return postRegisterQueue(undefined, applicantCount, token, userID, timingID, name, nik);
        } else if (Success && jumlah === 5) {
          return { data: { Message: 'Kuota habis', errorCode: 400 }};
        }

        return { data: { Message, errorCode: 401 } };
      }).then(({ data }) => {
        const {
          Message, NO_ANTRIAN, Success, errorCode,
        } = parseJSONIfString(data);

        if (!Message || Success) {
          response.data = { queueNumber: NO_ANTRIAN };
          response.success = true;
        } else {
          response.message = Message;
          response.errorCode = errorCode;
        }

        res.send(response);
      }).catch(err => res.send({
        success: false,
        message: err,
      }));
    }
  });
};
