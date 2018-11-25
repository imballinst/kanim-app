const request = require('./_base');

const paths = {
  getOffices: '/rest/PostKanim.jsp',
  getAvailability: '/rest/AvailabilityInfo.jsp',
  getQuotaInfo: '/rest/QuotaInfo.jsp',
};

const getOffices = cookie =>
  request(
    paths.getOffices,
    'post',
    {
      // Sadly this params won't work
      SearchKeyWord: '',
    },
    cookie
  );

const getAvailability = (cookie, token, kanimID, startDate, endDate) => request(
  paths.getAvailability,
  'post',
  {
    Token: token,
    KANIM_ID: kanimID,
    START_DATE: startDate,
    END_DATE: endDate,
  },
  cookie
);

const getQuotaInfo = (cookie, token, kanimID, date, startHr, endHr) =>
  request(
    paths.getQuotaInfo,
    'post',
    {
      Token: token,
      KANIM_ID: kanimID,
      REQUESTED_DATE: date,
      START_HOUR: startHr,
      END_HOUR: endHr,
    },
    cookie
  );

module.exports = {
  getOffices,
  getAvailability,
  getQuotaInfo,
};
