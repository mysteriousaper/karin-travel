import './globals.css';

// The <html> element is rendered by app/[locale]/layout.tsx (public site,
// with the right `lang`) and by app/admin/layout.tsx (admin panel).
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
