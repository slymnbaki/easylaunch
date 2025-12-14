// MongoDB otomatik yedekleme scripti
const { exec } = require('child_process');
const path = require('path');
const backupDir = path.join(__dirname, '../backups');
const dbName = process.env.MONGO_URI?.split('/').pop().split('?')[0] || 'easylaunch';
const cmd = `mongodump --uri="${process.env.MONGO_URI}" --out="${backupDir}/backup-$(date +%Y%m%d-%H%M%S)"`;
exec(cmd, (err, stdout, stderr) => {
  if (err) console.error('Yedekleme hatası:', err);
  else console.log('Yedekleme tamamlandı:', stdout);
});
