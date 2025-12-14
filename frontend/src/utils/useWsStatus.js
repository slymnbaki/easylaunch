// React hook ile WebSocket üzerinden canlı durum takibi
import { useEffect, useState } from 'react';
export default function useWsStatus() {
  const [status, setStatus] = useState('pending');
  useEffect(() => {
    const ws = new window.WebSocket('ws://localhost:8081');
    ws.onmessage = e => {
      const data = JSON.parse(e.data);
      if (data.type === 'status') setStatus(data.status);
    };
    return () => ws.close();
  }, []);
  return status;
}
