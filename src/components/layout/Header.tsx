import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '@src/components/ui/Button';
import { supabase } from '@src/lib/supabase/client';
import { AuthModal, useAuthModal } from '@src/components/auth/AuthModal';
import { useLanguage } from '@src/lib/hooks/useLanguage';

// Language content
const content = {
  en: {
    'nav-home': 'Home',
    'nav-gallery': 'Gallery', 
    'nav-contact': 'Contact Us',
    'nav-menu': 'Order',
    'cabinet': 'Cabinet',
    'admin': 'Admin',
    'sign-in': 'Sign in',
    'log-out': 'Log out'
  },
  th: {
    'nav-home': 'หน้าหลัก',
    'nav-gallery': 'แกลเลอรี่',
    'nav-contact': 'ติดต่อเรา', 
    'nav-menu': 'สั่งซื้อ',
    'cabinet': 'ตู้เก็บของ',
    'admin': 'ผู้ดูแล',
    'sign-in': 'เข้าสู่ระบบ',
    'log-out': 'ออกจากระบบ'
  }
};

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | undefined>(undefined);
  const { language, setLanguage } = useLanguage();
  const auth = useAuthModal();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(!!data.session);
      const metaRole = data.session?.user?.app_metadata?.role as string | undefined;
      setUserRole(metaRole);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(!!session);
      const metaRole = session?.user?.app_metadata?.role as string | undefined;
      setUserRole(metaRole);
    });
    return () => { sub?.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (toggleRef.current?.contains(target)) return;
      setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [menuOpen]);

  const t = (key: string) => content[language][key as keyof typeof content.en] || key;

  const tabLink = (to: string, labelKey: string) => (
    <NavLink key={to} to={to} className={({ isActive }) => `px-3 py-2 rounded transition-colors text-white hover:text-white/80 ${isActive ? 'bg-white/20' : ''}`}>
      {t(labelKey)}
    </NavLink>
  );

  // Admin access is determined by Supabase user.app_metadata.role === 'admin'

  return (
    <header className="bg-purple-600 shadow-lg relative">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/pics/Logo.png" alt="Logo" className="h-12" />
          <span className="font-bold text-white text-xl">Crepe</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-2">
          {tabLink('/', 'nav-home')}
          {tabLink('/order', 'nav-menu')}
          {tabLink('/gallery', 'nav-gallery')}
          {tabLink('/contact', 'nav-contact')}
        </nav>

        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="flex gap-2">
            <button 
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-xs rounded transition-colors ${language === 'en' ? 'bg-white text-purple-600' : 'bg-white/20 text-white'}`}
            >
              <img src="/pics/flag_us.jpg" alt="EN" className="w-4 h-3 inline mr-1" />
              EN
            </button>
            <button 
              onClick={() => setLanguage('th')}
              className={`px-2 py-1 text-xs rounded transition-colors ${language === 'th' ? 'bg-white text-purple-600' : 'bg-white/20 text-white'}`}
            >
              <img src="/pics/th_flag.jpg" alt="TH" className="w-4 h-3 inline mr-1" />
              TH
            </button>
          </div>

          {/* Desktop Sign In Button */}
          <div className="hidden md:block">
            {signedIn ? (
              <Button variant="secondary" onClick={async () => await supabase.auth.signOut()}>
                {t('log-out')}
              </Button>
            ) : (
              <Button onClick={() => auth.show()}>
                {t('sign-in')}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded hover:bg-white/20 text-white" 
            onClick={() => setMenuOpen(!menuOpen)} 
            aria-label="Menu"
            ref={toggleRef}
          >
            <span className="block w-5 h-0.5 bg-current mb-1"></span>
            <span className="block w-5 h-0.5 bg-current mb-1"></span>
            <span className="block w-5 h-0.5 bg-current"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div ref={menuRef} className="md:hidden absolute top-full right-2 mt-2 bg-white text-gray-800 border border-gray-200 rounded-lg shadow-xl p-3 space-y-2 z-50 w-56">
          {signedIn ? (
            <>
              <NavLink to="/cabinet" onClick={() => setMenuOpen(false)} className="block px-2 py-1 rounded hover:bg-gray-100">
                {t('cabinet')}
              </NavLink>
              {userRole === 'admin' && (
                <NavLink to="/admin" onClick={() => setMenuOpen(false)} className="block px-2 py-1 rounded hover:bg-gray-100">
                  {t('admin')}
                </NavLink>
              )}
              <button className="block w-full text-left px-2 py-1 rounded hover:bg-gray-100" onClick={async () => { setMenuOpen(false); await supabase.auth.signOut(); }}>
                {t('log-out')}
              </button>
            </>
          ) : (
            <button className="block w-full text-left px-2 py-1 rounded hover:bg-gray-100" onClick={() => { setMenuOpen(false); auth.show(); }}>
              {t('sign-in')}
            </button>
          )}
        </div>
      )}

      {/* Mobile Navigation Tabs */}
      <div className="md:hidden bg-purple-600 border-t border-purple-500">
        <nav className="flex items-center justify-around px-2 py-2">
          {tabLink('/', 'nav-home')}
          {tabLink('/order', 'nav-menu')}
          {tabLink('/gallery', 'nav-gallery')}
          {tabLink('/contact', 'nav-contact')}
        </nav>
      </div>

      <AuthModal ctrl={auth} />
    </header>
  );
}
