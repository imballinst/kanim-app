## kanim-app [Status: WIP Prototype]

Sometimes, it is really annoying to refresh https://antrian.imigrasi.go.id/ over time in order to do online registration. I don't want to repeat that kind of time-wasting action, so instead, I reverse-engineered their website and intended to build a brand new application.

### What's Special About This

Interval registration checking. If you want to register at certain date and time in the future and it's not available yet, this application will send you a notification when it becomes available in the future.

### Steps

1. Fetch all immigration offices' quota for the next 3 months
2. Query database for active subscribers, get their data (office for registration and date ranges)
3. For each subscriber's data, do:
    3.1. Check the quota availability for the chosen office during the date range
    3.2. If available, send a notification
    3.3. If not available, do nothing

### How to Use

1. Clone this repository
2. `npm install`
3. Copy `.env.example` to `.env` and fill the variable values
4. `node index.js`

### License

MIT
