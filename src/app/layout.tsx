import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Clandestine Access',
  description: 'Conteúdos restritos, raros e privados.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Space+Grotesk:wght@700;800&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <div className="noise-overlay"></div>
        <div className="vignette-overlay"></div>
        <div className="radial-gradient-overlay"></div>
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
