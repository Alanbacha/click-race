import './globals.css';
import { SocketProvider } from '@/contexts/SocketContext';

export const metadata = {
  title: 'Click Race - Quem clica primeiro?',
  description: 'Jogo multiplayer em tempo real',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Click Race' },
  icons: { apple: '/icon-192.png' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-mesh">
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}
