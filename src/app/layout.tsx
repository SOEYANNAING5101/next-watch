import "./globals.css";
import Navbar from './components/NavBar'
import { Toaster } from 'sonner'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">

      <body className="bg-slate-950">
        <Navbar />
        {children}
        <Toaster
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: '#020617', 
              borderColor: '#1e293b', 
              color: '#f3f4f6', 
            },
          }} />
      </body>
    </html>
  );
}