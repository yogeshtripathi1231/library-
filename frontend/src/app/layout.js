import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import '@/styles/globals.css';

export const metadata = {
  title: 'Library Management System',
  description: 'Complete library management solution with book requests and admin controls',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
