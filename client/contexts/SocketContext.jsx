'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createSocket } from '@/lib/socket';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = createSocket();
    setSocket(s);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/52dfa0eb-968d-4933-8c3b-938ecdff2203',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SocketContext.jsx:useEffect','message':'socket state set',data:{socketId:s?.id,connected:s?.connected},timestamp:Date.now(),hypothesisId:'H3'})}).catch(()=>{});
    // #endregion
    return () => s.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const socket = useContext(SocketContext);
  if (!socket) throw new Error('useSocket must be used within SocketProvider');
  return socket;
}
