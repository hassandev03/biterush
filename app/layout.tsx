import type {Metadata} from 'next';
import './globals.css'; // Global styles
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'BiteRush | Food & Product Ordering',
  description: 'A complete food/product ordering platform',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex flex-col font-sans text-gray-900" suppressHydrationWarning>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
