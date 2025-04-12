
import React, { ReactNode } from 'react';
import Header from './Header';
import MobileNav from './MobileNav';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pb-20 md:pb-10">
        {children}
      </main>
      {isMobile && <MobileNav />}
    </div>
  );
};

export default Layout;
