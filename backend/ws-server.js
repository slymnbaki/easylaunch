// Basit WebSocket sunucusu (token üretim ve ödeme durumu için)
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', ws => {
  ws.send(JSON.stringify({ type: 'welcome', msg: 'WebSocket bağlantısı kuruldu!' }));
  // Demo: Her 10 sn'de bir random durum bildirimi
  setInterval(() => {
    ws.send(JSON.stringify({ type: 'status', status: Math.random() > 0.5 ? 'success' : 'pending' }));
  }, 10000);
});

console.log('WebSocket server running on ws://localhost:8081');
