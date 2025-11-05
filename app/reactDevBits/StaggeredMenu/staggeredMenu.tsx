import React, { useCallback, useEffect, useLayoutEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import { CustomButton } from '@/app/components/utils/button';
import { gsap } from 'gsap';
import './staggeredMenu.css';
import { useTheme } from '@mui/material/styles';

export interface StaggeredMenuItem {
  label: string;
  ariaLabel: string;
  link: string;
}

export interface StaggeredMenuSection {
  title: string;
  items: StaggeredMenuItem[];
}

export interface StaggeredMenuSocialItem {
  label: string;
  link: string;
}

export interface StaggeredMenuProps {
  position?: 'left' | 'right';
  colors?: string[];
  items?: StaggeredMenuItem[];
  sections?: StaggeredMenuSection[];
  activeItem?: { sectionTitle?: string; label: string };
  onItemSelect?: (item: StaggeredMenuItem, meta: { sectionTitle?: string; sectionIndex?: number; itemIndex: number }) => void;
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  logoUrl?: string;
  headerTitle?: string;
  headerOnClick?: () => void;
  headerCtaLabel?: string;
  headerCtaOnClick?: () => void;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  changeMenuColorOnOpen?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  isFixed?: boolean;
  panelStyle?: React.CSSProperties;
  itemStyle?: React.CSSProperties;
  showHeader?: boolean;
  fitContainer?: boolean;
  prelayersStyle?: React.CSSProperties;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAfterOpen?: () => void;
  onAfterClose?: () => void;
  // Optional profile button at bottom
  profileName?: string;
  profileEmail?: string;
  profileAvatarUrl?: string;
  onProfileClick?: () => void;
}

export interface StaggeredMenuHandle {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
}

export const StaggeredMenu = forwardRef<StaggeredMenuHandle, StaggeredMenuProps>(({ 
  position = 'right',
  colors = ['#B19EEF', '#5227FF'],
  items = [],
  sections = [],
  activeItem,
  onItemSelect,
  profileName = 'Young Alaska',
  profileEmail = 'alskymg@gmail.com',
  profileAvatarUrl,
  onProfileClick,
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logoUrl = '/src/assets/logos/reactbits-gh-white.svg',
  headerTitle,
  headerOnClick,
  headerCtaLabel,
  headerCtaOnClick,
  menuButtonColor = '#fff',
  openMenuButtonColor = '#fff',
  changeMenuColorOnOpen = true,
  accentColor = '#5227FF',
  isFixed = false,
  panelStyle,
  itemStyle,
  showHeader = true,
  fitContainer = false,
  prelayersStyle,
  open: controlledOpen,
  onOpenChange,
  onMenuOpen,
  onMenuClose,
  onAfterOpen,
  onAfterClose
}, ref) => {
  const isControlled = typeof controlledOpen === 'boolean';
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = isControlled ? (controlledOpen as boolean) : uncontrolledOpen;
  const openRef = useRef(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const preLayersRef = useRef<HTMLDivElement | null>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);
  const plusHRef = useRef<HTMLSpanElement | null>(null);
  const plusVRef = useRef<HTMLSpanElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);
  const textInnerRef = useRef<HTMLSpanElement | null>(null);
  const textWrapRef = useRef<HTMLSpanElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const [textLines, setTextLines] = useState<string[]>(['Menu', 'Close']);

  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const spinTweenRef = useRef<gsap.core.Tween | null>(null);
  const textCycleAnimRef = useRef<gsap.core.Tween | null>(null);
  const colorTweenRef = useRef<gsap.core.Tween | null>(null);
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const busyRef = useRef(false);
  const itemEntranceTweenRef = useRef<gsap.core.Tween | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
  const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;
  const headerEl = headerRef.current;

      let preLayers: HTMLElement[] = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer')) as HTMLElement[];
      }
      preLayerElsRef.current = preLayers;

  const offscreen = position === 'left' ? -100 : 100;
      if (panel) gsap.set(panel, { xPercent: offscreen });
      if (preLayers.length) gsap.set(preLayers, { xPercent: offscreen });
  if (headerEl) gsap.set(headerEl, { xPercent: offscreen });
      if (plusH) gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
      if (plusV) gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
      if (icon) gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
      if (textInner) gsap.set(textInner, { yPercent: 0 });
      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
  const panel = panelRef.current;
  const headerEl = headerRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];
    const numberEls = Array.from(
      panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')
    ) as HTMLElement[];
    const socialTitle = panel.querySelector('.sm-socials-title') as HTMLElement | null;
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link')) as HTMLElement[];
    const sectionTitles = Array.from(panel.querySelectorAll('.sm-section-title')) as HTMLElement[];

    // --- FIX: Always start from a defined offscreen position ---
    const offscreenX = position === 'left' ? -100 : 100;

    if (itemEls.length) {
      gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    }
    if (numberEls.length) {
      gsap.set(numberEls, { '--sm-num-opacity': 0 });
    }
    if (socialTitle) {
      gsap.set(socialTitle, { opacity: 0 });
    }
    if (socialLinks.length) {
      gsap.set(socialLinks, { y: 25, opacity: 0 });
    }
    if (sectionTitles.length) {
      gsap.set(sectionTitles, { y: 20, opacity: 0 });
    }

    const tl = gsap.timeline({ paused: true });

    const layerDur = 0.5;
    const layerStagger = 0.09;
    
    layers.forEach((el, i) => {
      tl.fromTo(
        el,
        { xPercent: offscreenX }, // Use the calculated offscreen value
        { xPercent: 0, duration: layerDur, ease: 'power4.out' },
        i * layerStagger
      );
    });

  const lastLayerTime = layers.length ? (layers.length - 1) * layerStagger : 0;
    const panelInsertTime = lastLayerTime + (layers.length ? layerDur - 0.1 : 0);
    const panelDuration = 0.65;
    
    tl.fromTo(
      panel,
      { xPercent: offscreenX }, // Use the calculated offscreen value
      { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
      panelInsertTime
    );

    // Animate header (title + close button) in sync with the panel
    if (headerEl) {
      tl.fromTo(
        headerEl,
        { xPercent: offscreenX },
        { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
        panelInsertTime
      );
    }

    if (itemEls.length) {
      const itemsStartRatio = 0.15;
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;
      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: 'power4.out',
          stagger: { each: 0.1, from: 'start' }
        },
        itemsStart
      );
      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.6,
            ease: 'power2.out',
            '--sm-num-opacity': 1,
            stagger: { each: 0.08, from: 'start' }
          },
          itemsStart + 0.1
        );
      }
      if (sectionTitles.length) {
        tl.to(
          sectionTitles,
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power3.out',
            stagger: { each: 0.06, from: 'start' }
          },
          itemsStart - 0.05
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;
      if (socialTitle) {
        tl.to(
          socialTitle,
          {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out'
          },
          socialsStart
        );
      }
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out',
            stagger: { each: 0.08, from: 'start' },
            onComplete: () => {
              gsap.set(socialLinks, { clearProps: 'opacity' });
            }
          },
          socialsStart + 0.04
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => {
        busyRef.current = false;
        onAfterOpen?.();
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline, onAfterOpen]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();

  const panel = panelRef.current;
  const headerEl = headerRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

  const all: HTMLElement[] = headerEl ? [...layers, headerEl, panel] : [...layers, panel];
    closeTweenRef.current?.kill();
    const offscreen = position === 'left' ? -100 : 100;
    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];
        if (itemEls.length) {
          gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        }
        const numberEls = Array.from(
          panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')
        ) as HTMLElement[];
        if (numberEls.length) {
          gsap.set(numberEls, { '--sm-num-opacity': 0 });
        }
        const socialTitle = panel.querySelector('.sm-socials-title') as HTMLElement | null;
        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link')) as HTMLElement[];
        const sectionTitles = Array.from(panel.querySelectorAll('.sm-section-title')) as HTMLElement[];
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
        if (sectionTitles.length) gsap.set(sectionTitles, { y: 20, opacity: 0 });
        busyRef.current = false;
        onAfterClose?.();
      }
    });
  }, [position, onAfterClose]);

  // Close button icon should not rotate; keep rotation at 0 and disable animation
  const animateIcon = useCallback((_opening: boolean) => {
    const icon = iconRef.current;
    if (!icon) return;
    spinTweenRef.current?.kill();
    gsap.set(icon, { rotate: 0 });
  }, []);

  const animateColor = useCallback(
    (opening: boolean) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, {
          color: targetColor,
          delay: 0.18,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.set(btn, { color: menuButtonColor });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  );

  React.useEffect(() => {
    if (toggleBtnRef.current) {
      if (changeMenuColorOnOpen) {
        const targetColor = openRef.current ? openMenuButtonColor : menuButtonColor;
        gsap.set(toggleBtnRef.current, { color: targetColor });
      } else {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const animateText = useCallback((opening: boolean) => {
    const inner = textInnerRef.current;
    if (!inner) return;
    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? 'Menu' : 'Close';
    const targetLabel = opening ? 'Close' : 'Menu';
    const cycles = 3;
    const seq: string[] = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === 'Menu' ? 'Close' : 'Menu';
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);
    setTextLines(seq);

    gsap.set(inner, { yPercent: 0 });
    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;
    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: 'power4.out'
    });
  }, []);

  const setOpenInternal = useCallback((target: boolean) => {
    openRef.current = target;
    if (!isControlled) {
      setUncontrolledOpen(target);
    } else {
      onOpenChange?.(target);
    }
    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }
    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [isControlled, onOpenChange, onMenuOpen, onMenuClose, playOpen, playClose, animateIcon, animateColor, animateText]);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    setOpenInternal(target);
  }, [setOpenInternal]);

  useEffect(() => {
    if (typeof controlledOpen === 'boolean' && controlledOpen !== openRef.current) {
      setOpenInternal(controlledOpen);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlledOpen]);

  useImperativeHandle(ref, () => ({
    open: () => setOpenInternal(true),
    close: () => setOpenInternal(false),
    toggle: () => toggleMenu(),
    isOpen: () => openRef.current
  }), [setOpenInternal, toggleMenu]);

  type CSSVars = React.CSSProperties & Record<'--sm-accent', string>;
  const theme = useTheme();

  return (
    <div
      className={(className ? className + ' ' : '') + 'staggered-menu-wrapper' + (isFixed ? ' fixed-wrapper' : '')}
      style={accentColor ? ({ ['--sm-accent']: accentColor } as CSSVars) : undefined}
      data-position={position}
      data-open={open || undefined}
      data-fit={fitContainer ? 'container' : undefined}
    >
  <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true" style={prelayersStyle}>
        {(() => {
          const base = colors && colors.length ? colors.slice(0, 4) : ['#1e1e22', '#35353c'];
          let arr: string[] = [];
          while (arr.length < 3) {
            arr = arr.concat(base);
            if (arr.length > 6) break;
          }
          arr = arr.slice(0, Math.max(3, Math.min(4, arr.length)));
          return arr.map((c, i) => <div key={i} className="sm-prelayer" style={{ background: c }} />);
        })()}
      </div>
      {showHeader && (
        <header ref={headerRef} className="staggered-menu-header" aria-label="Main navigation header">
          <div className="sm-logo" aria-label="Logo">
            {headerTitle ? (
              <button
                type="button"
                className="sm-logo-button"
                onClick={headerOnClick}
                aria-label={headerTitle}
              >
                {headerTitle}
              </button>
            ) : (
              <img
                src={logoUrl || '/src/assets/logos/reactbits-gh-white.svg'}
                alt="Logo"
                className="sm-logo-img"
                draggable={false}
                width={110}
                height={24}
              />
            )}
          </div>

          {/* hamburger toggle on the right of the header */}
          <button
            ref={toggleBtnRef}
            className="sm-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="staggered-menu-panel"
            onClick={toggleMenu}
            type="button"
          >
            <span ref={iconRef} className="sm-icon" aria-hidden="true">
              <MenuOutlinedIcon sx={{ color: '#fff' }} fontSize="small" />
            </span>
          </button>
        </header>
      )}

      <aside
        id="staggered-menu-panel"
        ref={panelRef}
        className="staggered-menu-panel"
        aria-hidden={!open}
        style={panelStyle}
      >
        <div className="sm-panel-inner">
          {headerCtaLabel && (
            <CustomButton
              color="primary"
              icon={<ChatOutlinedIcon sx={{ color: 'var(--sm-accent)' }} fontSize="small" />}
              label={headerCtaLabel}
              onClick={headerCtaOnClick}
              fullWidth
              sx={{
                backgroundColor: '#fff',
                color: theme.palette.secondary.main,
                boxShadow: '0 3px 0 rgba(0,0,0,0.06)',
                borderRadius: '12px',
                fontSize: { xs: 12, md: 14, lg: 16 },
                '&:hover': {
                  backgroundColor: theme.palette.background.default,
                },
              }}
              containerSx={{ mb: 2 }}
            />
          )}
          {sections && sections.length > 0 ? (
            <div className="sm-panel-sections">
              {sections.map((sec, si) => (
                <section
                  key={sec.title + si}
                  className={`sm-panel-section sm-section--${(sec.title || '').toUpperCase()}`}
                >
                  <h3 className="sm-section-title" aria-label={`${sec.title} section`}>{sec.title}</h3>
                  <ul className="sm-panel-list" role="list" data-numbering={displayItemNumbering || undefined}>
                    {sec.items && sec.items.length ? (
                      sec.items.map((it, idx) => {
                        const isActive = !!activeItem && activeItem.label === it.label && (!activeItem.sectionTitle || activeItem.sectionTitle === sec.title);
                        const useButton = !it.link || it.link === '#';
                        const className = 'sm-panel-item' + (isActive ? ' sm-panel-item--active' : '');
                        return (
                          <li className="sm-panel-itemWrap" key={it.label + idx}>
                            {useButton ? (
                              <button
                                type="button"
                                className={className}
                                aria-label={it.ariaLabel}
                                data-index={idx + 1}
                                style={itemStyle}
                                onClick={() => onItemSelect?.(it, { sectionTitle: sec.title, sectionIndex: si, itemIndex: idx })}
                              >
                                <span className="sm-panel-itemLabel" style={itemStyle}>{it.label}</span>
                              </button>
                            ) : (
                              <a
                                className={className}
                                href={it.link}
                                aria-label={it.ariaLabel}
                                data-index={idx + 1}
                                style={itemStyle}
                                onClick={(e) => {
                                  if (onItemSelect) {
                                    onItemSelect(it, { sectionTitle: sec.title, sectionIndex: si, itemIndex: idx });
                                  }
                                }}
                              >
                                <span className="sm-panel-itemLabel" style={itemStyle}>{it.label}</span>
                              </a>
                            )}
                          </li>
                        );
                      })
                    ) : (
                      <li className="sm-panel-itemWrap" aria-hidden="true">
                        <span className="sm-panel-item">
                          <span className="sm-panel-itemLabel">No items</span>
                        </span>
                      </li>
                    )}
                  </ul>
                </section>
              ))}
            </div>
          ) : (
            <ul className="sm-panel-list" role="list" data-numbering={displayItemNumbering || undefined}>
              {items && items.length ? (
                items.map((it, idx) => (
                  <li className="sm-panel-itemWrap" key={it.label + idx}>
                    <a
                      className="sm-panel-item"
                      href={it.link}
                      aria-label={it.ariaLabel}
                      data-index={idx + 1}
                      style={itemStyle}
                    >
                      <span className="sm-panel-itemLabel" style={itemStyle}>{it.label}</span>
                    </a>
                  </li>
                ))
              ) : (
                <li className="sm-panel-itemWrap" aria-hidden="true">
                  <span className="sm-panel-item">
                    <span className="sm-panel-itemLabel">No items</span>
                  </span>
                </li>
              )}
            </ul>
          )}
          {displaySocials && socialItems && socialItems.length > 0 && (
            <div className="sm-socials" aria-label="Social links">
              <h3 className="sm-socials-title">Socials</h3>
              <ul className="sm-socials-list" role="list">
                {socialItems.map((s, i) => (
                  <li key={s.label + i} className="sm-socials-item">
                    <a href={s.link} target="_blank" rel="noopener noreferrer" className="sm-socials-link">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Profile button docked to bottom INSIDE the panel */}
          <button
            type="button"
            className="sm-profile"
            onClick={onProfileClick}
            aria-label={profileName ? `${profileName} profile` : 'Profile'}
          >
            <span className="sm-profile-avatar" aria-hidden="true">
              {profileAvatarUrl ? (
                <img src={profileAvatarUrl} alt="" className="sm-profile-avatarImg" />
              ) : (
                (profileName || 'U').charAt(0)
              )}
            </span>
            <span className="sm-profile-text">
              <span className="sm-profile-name">{profileName}</span>
              <span className="sm-profile-email">{profileEmail}</span>
            </span>
            <span className="sm-profile-caret" aria-hidden="true">
              <KeyboardArrowDownOutlinedIcon fontSize="small" />
            </span>
          </button>
        </div>
      </aside>
    </div>
  );
});

StaggeredMenu.displayName = 'StaggeredMenu';

export default StaggeredMenu;