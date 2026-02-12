'use client';

import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

export function createSocket() {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/52dfa0eb-968d-4933-8c3b-938ecdff2203',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'socket.js:createSocket','message':'createSocket called',data:{SOCKET_URL},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
  // #endregion
  const socket = io(SOCKET_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
  });
  socket.on('connect', () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/52dfa0eb-968d-4933-8c3b-938ecdff2203',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'socket.js:connect','message':'socket connected',data:{id:socket.id},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
    // #endregion
  });
  socket.on('connect_error', (err) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/52dfa0eb-968d-4933-8c3b-938ecdff2203',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'socket.js:connect_error','message':'socket connect_error',data:{message:err?.message,String:String(err)},timestamp:Date.now(),hypothesisId:'H4'})}).catch(()=>{});
    // #endregion
  });
  return socket;
}
