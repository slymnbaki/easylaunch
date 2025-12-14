const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../../logs/activity.log');

module.exports = (req, res, next) => {
  const logEntry = `${new Date().toISOString()} | ${req.method} ${req.originalUrl} | User: ${req.user?.userId || 'anon'}\n`;
  fs.appendFile(logFile, logEntry, err => {
    if (err) console.error('Log yazılamadı:', err);
  });
  next();
};
