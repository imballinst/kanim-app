// For development purposes
module.exports = {
  apps: [
    {
      name: 'kanim-app',
      script: './bin/www',
      watch: true,
      ignore_watch: ['.git/'],
    },
  ],
};
