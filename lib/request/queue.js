const request = require('./_base');

const paths = {
  registerQueue: '/rest/RegisterQueue.jsp',
  getQueues: '/rest/ListQueue.jsp',
  deleteQueue: '/rest/CancelQueue.jsp',
};

const registerQueue = (cookie, applicantCount, token, userID, tID, name, nik) =>
  request(
    paths.registerQueue,
    'post',
    {
      JumlahPemohon: applicantCount,
      Token: token,
      UserId: userID,
      DetailTimingId: tID,
      NAMA_PENGANTRI_1: name,
      NIK_PENGANTRI_1: nik,
    },
    cookie
  );

const getQueues = (cookie, token, userID) =>
  request(
    paths.getQueues,
    'post',
    {
      Token: token,
      UserId: userID,
    },
    cookie
  );

const deleteQueue = (cookie, queueNumber) =>
  request(
    paths.deleteQueue,
    'post',
    {
      NO_ANTRIAN: queueNumber,
    },
    cookie
  );

module.exports = { registerQueue, getQueues, deleteQueue };
