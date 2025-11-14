"use client";
import React from 'react';
import { createPortal } from 'react-dom';
import StaggeredMenu, { StaggeredMenuSection, StaggeredMenuItem } from '@/app/reactDevBits/StaggeredMenu/staggeredMenu';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

export interface MobileStaggeredDrawerProps {
  open: boolean;
  onClose: () => void;
  pages: { label: string; href: string }[];
  isLoggedIn: boolean;
  onNavigate: (href: string) => void;
  onLogout?: () => void;
}

// Mobile drawer that mimics InvestorsDashboard StaggeredMenu styling, anchored on the right.
export function MobileStaggeredDrawer({ open, onClose, pages, isLoggedIn, onNavigate, onLogout }: MobileStaggeredDrawerProps) {
  const theme = useTheme();
  const menuRef = React.useRef<any>(null);

  // Transform pages into StaggeredMenuItem list
  const menuItems: StaggeredMenuItem[] = pages.map(p => ({ label: p.label.toUpperCase(), ariaLabel: p.label, link: p.href }));

  // Append auth item(s)
  if (isLoggedIn) {
    menuItems.push({ label: 'MY ACCOUNT', ariaLabel: 'My Account', link: '/user' });
    if (onLogout) {
      menuItems.push({ label: 'LOG OUT', ariaLabel: 'Log out', link: '#logout' });
    }
  } else {
    menuItems.push({ label: 'LOG IN', ariaLabel: 'Log in', link: '/login' });
  }

  const sections: StaggeredMenuSection[] = [
    { title: 'GENERAL', items: menuItems }
  ];

  // Disable body scroll while open & add ESC key close
  React.useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  // Trigger open animation on mount
  React.useEffect(() => {
    if (menuRef.current && open) {
      menuRef.current.open?.();
    }
  }, [open]);

  const [showCloseButton, setShowCloseButton] = React.useState(false);

  // Inject styles to completely eliminate shadow layers and ensure clickability
  React.useEffect(() => {
    if (!open) return;
    const style = document.createElement('style');
    style.textContent = `
      .staggered-menu-wrapper .sm-prelayers { display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; }
      .staggered-menu-wrapper .staggered-menu-panel { box-shadow: none !important; pointer-events: auto !important; }
      .staggered-menu-wrapper .sm-panel-item { pointer-events: auto !important; }
      .staggered-menu-wrapper .sm-panel-list { pointer-events: auto !important; }
      .staggered-menu-wrapper .staggered-menu-header { pointer-events: auto !important; }
      .staggered-menu-wrapper .sm-toggle { color: #cc0000 !important; visibility: visible !important; opacity: 1 !important; z-index: 9999999 !important; position: relative !important; }
      .staggered-menu-wrapper .staggered-menu-header { pointer-events: auto !important; z-index: 9999999 !important; }
      .staggered-menu-wrapper.fixed-wrapper .staggered-menu-header > * { pointer-events: auto !important; }
      .staggered-menu-wrapper .sm-profile { background: #ffffff !important; color: #cc0000 !important; }
      .staggered-menu-wrapper .sm-profile-name { color: #cc0000 !important; }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [open]);

  // Show close button after animation delay (~500ms)
  React.useEffect(() => {
    if (!open) {
      setShowCloseButton(false);
      return;
    }
    const timer = setTimeout(() => {
      setShowCloseButton(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [open]);

  // Use portal to escape ancestor stacking contexts
  return createPortal(
    <>
      {/* Semi-transparent backdrop click to close - behind everything */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.05)', zIndex: 999990, pointerEvents: 'auto' }}
      />
      {/* Escape X button on top-right corner - appears after animation */}
      {showCloseButton && (
        <IconButton
          onClick={onClose}
          aria-label="Close menu"
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 9999999,
            color: '#999999',
            '&:hover': {
              color: '#666666',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
      <div style={{ position: 'fixed', inset: 0, zIndex: 999999, display: 'block', pointerEvents: 'none' }}>
        <StaggeredMenu
        ref={menuRef}
        position="right"
        open={open}
        onOpenChange={(v) => { if (!v) onClose(); }}
        // Disable layered shading: hide prelayers via style and keep a single flat color
        colors={["#ffffff", "#ffffff", "#ffffff"]}
        sections={sections}
        headerTitle="Nomad Estate"
        headerOnClick={() => { onNavigate('/'); onClose(); }}
        showHeader
        displayItemNumbering={false}
        displaySocials={false}
        // Omit accentColor to remove themed highlight
        isFixed
        menuButtonColor="#0f172a"
        openMenuButtonColor="#cc0000"
        onItemSelect={(item) => {
          if (item.link === '#logout' && onLogout) {
            onLogout();
            onClose();
            return;
          }
          if (item.link && item.link.startsWith('/')) {
            onNavigate(item.link);
            onClose();
          }
        }}
        profileName={isLoggedIn ? 'Nomad Estate' : 'Nomad Estate'}
        profileEmail={isLoggedIn ? '' : ''}
        profileAvatarUrl="/logo.jpeg"
        onProfileClick={() => { onNavigate(isLoggedIn ? '/user' : '/login'); onClose(); }}
        // Custom styles for profile button
        // We'll inject CSS to style it red
        // Full-screen width with light background; remove box shadow for flat appearance
        panelStyle={{ background: '#ffffff', width: '100vw', boxShadow: 'none' }}
        // Hide prelayers entirely to eliminate residual shading edges
        prelayersStyle={{ width: '100vw', display: 'none' }}
        // Provide itemStyle for dark text since base CSS assumes white
        itemStyle={{ color: '#0f172a', fontSize: 14 }}
      />
      </div>
    </>,
    document.body
  );
}

export default MobileStaggeredDrawer;
