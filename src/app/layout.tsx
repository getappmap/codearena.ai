import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Dev Match',
  description: 'AI Dev Match',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex flex-col items-center p-24 min-h-screen">
          <div>
            <div>
              <a href="/">
                <h3 className="text-xl font-bold lg:text-xl">CodeArena.ai</h3>
              </a>{' '}
              by AppMap
            </div>
          </div>

          <div>{children}</div>
        </main>
      </body>
    </html>
  );
}
