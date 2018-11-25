## kanim-app [Status: Prototype]

[![wercker status](https://app.wercker.com/status/f75df002ca90a6b7d8639f5efc8fb188/s/ "wercker status")](https://app.wercker.com/project/byKey/f75df002ca90a6b7d8639f5efc8fb188)

Sometimes, it is really annoying to refresh https://antrian.imigrasi.go.id/ over time in order to do online registration. I don't want to repeat that kind of time-wasting action, so instead, I reverse-engineered their website and intended to build a brand new application.

### What's Special About This

Interval registration checking. If you want to register at certain date and time in the future and it's not available yet, this application will send you a notification when it becomes available in the future.

### Application Flow

1. Fetch all immigration offices' quota for the next 3 months
2. Query database for active subscribers, get their data (office for registration and date ranges)
3. For each subscriber's data, do:
   1. Check the quota availability for the chosen office during the date range
   2. If available, send a notification
   3. If not available, do nothing

### APIs

Route | Method | Purpose
----- | ------ | -------
`/user/{userID}/notification` | `GET` | Gets all notification for userID
`/user/{userID}/notification` | `POST` | Adds a new notification for userID
`/user/{userID}/notification/{notificationID}` | `POST` | Edits a notification for userID

### Prerequisites

1. NodeJS (at least `v6.11.5`)
2. NPM (at least `3.10.10`)
3. PM2 (at least `2.4.2`)
4. MongoDB (at least `3.2.13`)

### How to Use

1. Clone this repository
2. `yarn install`
3. Copy `.env.example` to `.env` and fill the variable values
4. `yarn start`

### License

MIT
