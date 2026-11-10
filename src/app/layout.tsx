import "./globals.css";
import { Toaster } from 'sonner'
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata = {
  title: "NextWatch",
  description: "Find your next watch.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="bg-ink font-sans">
        {children}
        <Toaster
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: '#17254C',
              borderColor: '#2A3A66',
              color: '#FFFFFF',
            },
          }} />
      </body>
    </html>
  );
}
