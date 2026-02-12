import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs';
import { RoomService } from './services/RoomService.js';
import { SocketHandler } from './handlers/SocketHandler.js';

const DEBUG_LOG = '/Users/alanbacha/Dev/.cursor/debug.log';
function debugLog(obj) {
  try {
    fs.appendFileSync(DEBUG_LOG, JSON.stringify({ ...obj, timestamp: Date.now() }) + '\n');
  } catch (_) {}
}

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
const app = express();
app.use(cors({ origin: CORS_ORIGIN }));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: CORS_ORIGIN },
});

const roomService = new RoomService();
const socketHandler = new SocketHandler(io, roomService);
socketHandler.setupHandlers();

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  // #region agent log
  debugLog({ location: 'index.js:listen', message: 'server listening', data: { PORT }, hypothesisId: 'H5' });
  fetch('http://127.0.0.1:7242/ingest/52dfa0eb-968d-4933-8c3b-938ecdff2203',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'index.js:listen','message':'server listening',data:{PORT},timestamp:Date.now(),hypothesisId:'H5'})}).catch(()=>{});
  // #endregion
});
