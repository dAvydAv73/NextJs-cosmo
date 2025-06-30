'use client';
import { usePathname } from 'next/navigation';

export default function ContentWrapper({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/' || pathname === '/fr' || pathname === '/en';

  return (
    <div id="content" className={`content ${isHomePage ? 'is-home' : 'not-home'}`}>
      {children}
    </div>
  );
}
