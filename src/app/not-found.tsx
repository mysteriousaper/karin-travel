// Fallback for URLs outside any locale (the middleware normally prefixes them).
export default function RootNotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', background: '#0F0F0E', color: '#F2EEE7', display: 'grid', placeItems: 'center', minHeight: '100vh', margin: 0 }}>
        <main style={{ textAlign: 'center', padding: 24 }}>
          <p style={{ fontSize: 64, margin: 0, fontWeight: 300 }}>404</p>
          <p>
            <a href="/hy" style={{ color: '#F6D7A8' }}>Karin Travel</a>
          </p>
        </main>
      </body>
    </html>
  );
}
