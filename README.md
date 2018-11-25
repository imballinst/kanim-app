# kanim-app [Status: Prototype]

[![wercker status](https://app.wercker.com/status/f75df002ca90a6b7d8639f5efc8fb188/s/ "wercker status")](https://app.wercker.com/project/byKey/f75df002ca90a6b7d8639f5efc8fb188)

Sometimes, it is really annoying to refresh https://antrian.imigrasi.go.id/ over time in order to do online registration. I don't want to repeat that kind of time-wasting action, so instead, I reverse-engineered their website and intended to build a brand new application.

## What's Special About This

Interval registration checking. If you want to register at certain date and time in the future and it's not available yet, this application will send you a notification when it becomes available in the future.

## APIs
### Authentication Ruotes

Route | Method | Description
----- | ------ | -------
`/login` | `POST` | Login with body `username` and `password`

### Office Ruotes

Route | Method | Description
----- | ------ | -------
`/offices` | `GET` | Get list of immigration offices
`/offices/{officeID}` | `GET` | Get the availabilities of an office with `startDate` and `endDate` as time range parameter
`/offices/{officeID}/check` | `POST` | Confirm the availability of a session in a certain day, given `date`, `startHour`, and `endHour` sent in the request body
`/offices/{officeID}/register` | `POST` | Register for the booking with the request body `applicantCount`, `userID`, `timingID`, `name`, and `nik`

### Queue Ruotes

Route | Method | Description
----- | ------ | -------
`/queue` | `GET` | Get list of registered bookings
`/queue/{queueNumber}` | `DELETE` | Delete a booked queue

### User Ruotes

Route | Method | Description
----- | ------ | -------
`/user/{userID}/notification` | `GET` | Get all notification for userID
`/user/{userID}/notification` | `POST` | Add a new notification for userID
`/user/{userID}/notification/{notificationID}` | `GET` | Get a notification owned by userID
`/user/{userID}/notification/{notificationID}` | `PUT` | Edit a notification owned by userID
`/user/{userID}/notification/{notificationID}` | `DELETE` | Delete a notification owned by userID

## Prerequisites

1. NodeJS (at least `v6.11.5`)
2. NPM (at least `3.10.10`)
3. PM2 (at least `2.4.2`)
4. MongoDB (at least `3.2.13`)

## How to Use

1. Clone this repository
2. `yarn install`
3. Copy `.env.example` to `.env` and fill the variable values
4. `yarn start`

## License

MIT
