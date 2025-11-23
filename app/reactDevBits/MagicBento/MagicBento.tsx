import React, { useRef, useCallback, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import './MagicBento.css';
import { Box, Slider, Typography, Stack, useMediaQuery, useTheme, IconButton } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import SingleBedOutlinedIcon from '@mui/icons-material/SingleBedOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import PercentOutlinedIcon from '@mui/icons-material/PercentOutlined';
import AddIcon from '@mui/icons-material/Add';
import DiamondIcon from '@mui/icons-material/Diamond';
import { CustomAutocomplete } from '../../components/utils/autocomplete';
import TagSearchInput, { type TagItem } from '@/app/components/utils/TagSearchInput';
import { searchCities, searchCountries } from '@/app/lib/locationApi';
import { getCountries, getCities, Country, City } from '@/app/lib/locationApi';
import CheckboxGroup, { type Option as CheckboxOption } from '../../components/utils/checkboxGroup';
import CustomButton from '../../components/utils/button';
import api from '../../lib/api';
// Centralized tag enums & helpers
import { INVESTMENT_GOAL_TAGS, LOCATION_BENEFIT_TAGS, isInvestmentGoalTag, isLocationBenefitTag } from '@/app/enums';
import { formatEnumLabel } from '@/app/lib/format';
import { CustomSelect } from '../../components/utils/select';
import { MapGlobeSwitcher } from "../../components/propertyDashComponents/MapGlobeSwitcher";
import { Location } from "../../components/propertyDashComponents/location";

export interface BentoCardProps {
  color?: string;
  title?: string;
  description?: string;
  label?: string;
  textAutoHide?: boolean;
  disableAnimations?: boolean;
}

export interface BentoProps {
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '132, 0, 255';
const MOBILE_BREAKPOINT = 768;

const cardData: BentoCardProps[] = [
  {
    color: '#060010',
    title: 'Analytics',
    description: 'Track user behavior',
    label: 'Insights',
  },
  {
    color: '#060010',
    title: 'Dashboard',
    description: 'Centralized data view',
    label: 'Overview',
  },
  {
    color: '#060010',
    title: 'Collaboration',
    description: 'Work together seamlessly',
    label: 'Teamwork',
  },
  {
    color: '#060010',
    title: 'Coming soon',
    description: 'View properties around the globe',
    label: 'Globe View',
  },
];

const createParticleElement = (
  x: number,
  y: number,
  color: string = DEFAULT_GLOW_COLOR,
): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

const updateCardGlowProperties = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number,
) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

const ParticleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  disableAnimations?: boolean;
  style?: React.CSSProperties;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}> = ({
  children,
  className = '',
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor),
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();

    particlesRef.current.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        },
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(
          clone,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' },
        );

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true,
        });

        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true,
        });
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 1000,
        });
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      }

      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: 'power2.out',
          transformPerspective: 1000,
        });
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05;
        const magnetY = (y - centerY) * 0.05;

        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height),
      );

      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;

      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        {
          scale: 0,
          opacity: 1,
        },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => ripple.remove(),
        },
      );
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      clearAllParticles();
    };
  }, [
    animateParticles,
    clearAllParticles,
    disableAnimations,
    enableTilt,
    enableMagnetism,
    clickEffect,
    glowColor,
  ]);

  return (
    <div
      ref={cardRef}
      className={`${className} particle-container`}
      style={{ ...style, position: 'relative', overflow: 'hidden' }}
    >
      {children}
    </div>
  );
};

const GlobalSpotlight: React.FC<{
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}> = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const isInsideSection = useRef(false);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current) return;

      const section = gridRef.current.closest('.bento-section');
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      isInsideSection.current = mouseInside || false;
      const cards = gridRef.current.querySelectorAll('.card');

      if (!mouseInside) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
        cards.forEach((card) => {
          (card as HTMLElement).style.setProperty('--glow-intensity', '0');
        });
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach((card) => {
        const cardElement = card as HTMLElement;
        const cardRect = cardElement.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(e.clientX - centerX, e.clientY - centerY) -
          Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(cardElement, e.clientX, e.clientY, glowIntensity, spotlightRadius);
      });

      gsap.to(spotlightRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      });

      const targetOpacity =
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
            : 0;

      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      isInsideSection.current = false;
      gridRef.current?.querySelectorAll('.card').forEach((card) => {
        (card as HTMLElement).style.setProperty('--glow-intensity', '0');
      });
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

const BentoCardGrid: React.FC<{
  children: React.ReactNode;
  gridRef?: React.RefObject<HTMLDivElement | null>;
}> = ({ children, gridRef }) => (
  <div className="card-grid bento-section" ref={gridRef}>
    {children}
  </div>
);

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

const MagicBento: React.FC<BentoProps> = ({
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
}) => {
  // Fetch all countries and cities for autocomplete
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [allCities, setAllCities] = useState<City[]>([]);
  useEffect(() => {
    (async () => {
      const countries = await getCountries();
      setAllCountries(countries);
      const cities = await getCities();
      setAllCities(cities);
    })();
  }, []);
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up('lg'));
  const globePageSize = isLarge ? 30 : 28;

  // Filters state (for first card)
  const [selectedCountries, setSelectedCountries] = useState<TagItem[]>([]);
  // Budget range slider default now spans full range (0 to 2,000,000)
  const [budget, setBudget] = useState<number[]>([0, 2000000]);
  const [goals, setGoals] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [goalsExpanded, setGoalsExpanded] = useState(false);
  const [benefitsExpanded, setBenefitsExpanded] = useState(false);
  const [selectedCities, setSelectedCities] = useState<TagItem[]>([]);
  const [propertyType, setPropertyType] = useState<string | number>('');
  const [bedrooms, setBedrooms] = useState<string | number>('');
  const [investmentScore, setInvestmentScore] = useState<string | number>('');
  const [expectedYield, setExpectedYield] = useState<string | number>('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  // Quick name search (separate from filters)
  const [quickQuery, setQuickQuery] = useState<string>('');

  // Globe locations derived from search results
  const [globeLocations, setGlobeLocations] = useState<Location[]>([]);
  // Simple hash fallback to turn string IDs into numeric keys when needed
  const hashCode = (str: string): number => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0; // Convert to 32bit integer
    }
    return h;
  };

  useEffect(() => {
    // Selected location id is tracked
  }, [selectedId]);

  // Countries and cities now use text search via TagSearchInput; no full retrieve on mount.

  // Cities are searched globally by text; no dependency on selected country.

  // Goal options now directly reflect the full backend InvestmentGoalTagEnum set
  const goalOptions: CheckboxOption[] = INVESTMENT_GOAL_TAGS.map(tag => ({
    value: tag,
    label: formatEnumLabel(tag),
  }));

  // Benefit options reflect full backend LocationBenefitTagEnum set
  const benefitOptions: CheckboxOption[] = LOCATION_BENEFIT_TAGS.map(tag => ({
    value: tag,
    label: formatEnumLabel(tag),
  }));

  // Rehydrate filters from last search so UI stays in sync with loaded results
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      // If last mode was name, rehydrate quick search bar
      const lastMode = sessionStorage.getItem('properties_last_mode');
      const lastQ = sessionStorage.getItem('properties_last_name_query');
      if (lastMode === 'name' && typeof lastQ === 'string') setQuickQuery(lastQ);

      const raw = sessionStorage.getItem('properties_last_search');
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        InvG?: string[];
        LocB?: string[];
        filterBody?: {
          minimumPrice?: number;
          maximumPrice?: number;
          location?: number;
          propertyType?: string | number;
          minimumScore?: number;
          minimumYield?: number;
          minimumNoBedrooms?: number;
        };
      };
      if (Array.isArray(parsed.InvG)) setGoals(parsed.InvG.filter(isInvestmentGoalTag));
      if (Array.isArray(parsed.LocB)) setBenefits(parsed.LocB.filter(isLocationBenefitTag));
      const fb = parsed.filterBody ?? {};
      const minP = typeof fb.minimumPrice === 'number' ? fb.minimumPrice : undefined;
      const maxP = typeof fb.maximumPrice === 'number' ? fb.maximumPrice : undefined;
      if (minP !== undefined || maxP !== undefined) {
        setBudget([minP ?? 0, maxP ?? 2000000]);
      }
      // Back-compat: If last search stored a single numeric city id, rehydrate as selected city tag placeholder
      if (typeof fb.location === 'number') setSelectedCities([{ id: fb.location, label: String(fb.location) }]);
      if (typeof fb.propertyType !== 'undefined') setPropertyType(fb.propertyType);
      if (typeof fb.minimumScore === 'number') setInvestmentScore(fb.minimumScore);
      if (typeof fb.minimumYield === 'number') {
        const my = fb.minimumYield;
        let v: string | number = '';
        if (my >= 11) v = '11_plus';
        else if (my >= 6) v = '6_10';
        else if (my >= 1) v = '1_5';
        setExpectedYield(v);
      }
      if (typeof fb.minimumNoBedrooms === 'number') setBedrooms(fb.minimumNoBedrooms >= 5 ? '5_PLUS' : fb.minimumNoBedrooms);
    } catch {
      // ignore rehydrate errors silently
    }
  }, []);

  const handleSearch = () => {
    // Mark mode as filters (exclusive with name search)
    try {
      if (typeof window !== 'undefined') sessionStorage.setItem('properties_last_mode', 'filters');
    } catch {}
    // Build FilterDto body and query params for /property/retrieve-search
    // Backend expects:
    // Query: InvG = InvestmentGoalTagEnum[] | InvestmentGoalTagEnum
    //        LocB = LocationBenefitTagEnum[] | LocationBenefitTagEnum
    // Body (FilterDto): {
    //   minimumPrice, maximumPrice, location (cityId), propertyType,
    //   minimumScore, minimumYield, minimumNoBedrooms
    // }
    // NOTE: Controller uses GET with @Body; axios will send `data` if we use request config.
    // Some intermediaries may strip GET bodies; if that happens consider changing to POST on both sides.

    // Helpers to coerce UI selections to backend numeric/enums
    const coerceBedrooms = (val: string | number | ''): number | undefined => {
      if (val === '' || val == null) return undefined;
      if (val === '5_PLUS') return 5; // treat 5+ as minimum 5
      const n = Number(val);
      return isNaN(n) ? undefined : n;
    };
    const coerceScore = (val: string | number | ''): number | undefined => {
      if (val === '' || val == null) return undefined;
      const n = Number(val);
      return isNaN(n) ? undefined : n;
    };
    const coerceYield = (val: string | number | ''): number | undefined => {
      if (val === '' || val == null) return undefined;
      // Map range selections to lower bound as minimumYield
      if (val === '1_5') return 1;
      if (val === '6_10') return 6;
      if (val === '11_plus') return 11;
      const n = Number(val);
      return isNaN(n) ? undefined : n;
    };

    // Direct mapping now: UI values are already backend enum strings
    const mappedInvG = (goals || []).filter(isInvestmentGoalTag);
    const mappedLocB = (benefits || []).filter(isLocationBenefitTag);

    type FilterBody = {
      minimumPrice?: number;
      maximumPrice?: number;
      // Deprecated: single city id; kept for back-compat if a single city is chosen
      location?: number;
      propertyType?: string | number;
      minimumScore?: number;
      minimumYield?: number;
      minimumNoBedrooms?: number;
      // New: tag-based filters
      cityTags?: string[];
      countryTags?: string[];
      cityIds?: Array<string | number>;
      countryIds?: Array<string | number>;
    };

    const cityIds = selectedCities.map((c) => c.id);
    const countryIds = selectedCountries.map((c) => c.id);
    const filterBody: FilterBody = {
      minimumPrice: budget?.[0],
      maximumPrice: budget?.[1],
      location: cityIds.length === 1 && typeof cityIds[0] === 'number' ? (cityIds[0] as number) : undefined,
      propertyType: propertyType || undefined,
      minimumScore: coerceScore(investmentScore),
      minimumYield: coerceYield(expectedYield),
      minimumNoBedrooms: coerceBedrooms(bedrooms),
      cityTags: selectedCities.map((c) => c.label),
      countryTags: selectedCountries.map((c) => c.label),
      cityIds,
      countryIds,
    };

    // Remove undefined keys to avoid validation errors
    (Object.keys(filterBody) as (keyof FilterBody)[]).forEach((k) => {
      if (filterBody[k] === undefined) delete filterBody[k];
    });

    const queryParams = {
      // Backend normalizes single vs array automatically
      InvG: mappedInvG.length ? mappedInvG : undefined,
      LocB: mappedLocB.length ? mappedLocB : undefined,
      cities: selectedCities.length ? selectedCities.map((c) => c.label) : undefined,
      countries: selectedCountries.length ? selectedCountries.map((c) => c.label) : undefined,
    } as const;

    // Persist last search so listings can reconstruct the body on reload
    try {
      if (typeof window !== 'undefined') {
        const toStore = { filterBody, InvG: queryParams.InvG, LocB: queryParams.LocB };
        sessionStorage.setItem('properties_last_search', JSON.stringify(toStore));
        // Clear last name search query when running filters
        sessionStorage.removeItem('properties_last_name_query');
      }
    } catch {}

    api.request({
      method: 'post',
      url: '/property/retrieve-search',
      params: queryParams,
      // Send tags redundantly in body as well so backend POST can read from either place
      data: {
        ...filterBody,
        InvG: mappedInvG.length ? mappedInvG : undefined,
        LocB: mappedLocB.length ? mappedLocB : undefined,
      },
    })
      .then((res) => {
        // Dispatch a custom event so listings page can listen & update without prop drilling
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('properties:filter-results', { detail: res.data }));
        }
        // Also map results to globe locations (ignore price constraints, keep backend order)
        try {
          const list = Array.isArray(res.data) ? (res.data as unknown[]) : [];
          // eslint-disable-next-line no-console
          console.log('[MagicBento] raw results count =', list.length);

          // Helper to coerce possible string/Decimal values to number
          const toNum = (v: unknown): number | null => {
            if (typeof v === 'number' && isFinite(v)) return v;
            if (typeof v === 'string') {
              const n = parseFloat(v);
              return isFinite(n) ? n : null;
            }
            // Prisma Decimal or other object with toString()
            if (v && typeof (v as { toString: () => string }).toString === 'function') {
              const s = (v as { toString: () => string }).toString();
              const n = parseFloat(s);
              return isFinite(n) ? n : null;
            }
            return null;
          };

          // Resolve latitude/longitude from common shapes
          const getLat = (p: unknown): number | null => {
            const obj = (p ?? {}) as Record<string, unknown>;
            const loc = obj['Location'] as (Record<string, unknown> | undefined);
            const loc2 = obj['location'] as (Record<string, unknown> | undefined);
            return (
              toNum(obj?.['latitude']) ??
              toNum(obj?.['lat']) ??
              toNum(loc?.['lat']) ??
              toNum(loc?.['latitude']) ??
              toNum(loc2?.['lat']) ??
              toNum(loc2?.['latitude']) ??
              null
            );
          };
          const getLng = (p: unknown): number | null => {
            const obj = (p ?? {}) as Record<string, unknown>;
            const loc = obj['Location'] as (Record<string, unknown> | undefined);
            const loc2 = obj['location'] as (Record<string, unknown> | undefined);
            return (
              toNum(obj?.['longitude']) ??
              toNum(obj?.['lng']) ??
              toNum(obj?.['lon']) ??
              toNum(loc?.['lng']) ??
              toNum(loc?.['lon']) ??
              toNum(loc?.['longitude']) ??
              toNum(loc2?.['lng']) ??
              toNum(loc2?.['lon']) ??
              toNum(loc2?.['longitude']) ??
              null
            );
          };

          // Keep only entries that have coercible coordinates and then take top N for the current layout
          const candidates = list
            .map((p) => ({ p, lat: getLat(p), lng: getLng(p) }))
            .filter(({ lat, lng }) => typeof lat === 'number' && typeof lng === 'number');

          const limited = candidates.slice(0, globePageSize);

          const locs: Location[] = limited.map(({ p, lat, lng }) => {
            const obj = (p ?? {}) as Record<string, unknown>;
            const idVal = obj['id'];
            const titleVal = obj['title'];
            return {
              id:
                typeof idVal === 'string'
                  ? Number(Math.abs(hashCode(idVal)))
                  : (typeof idVal === 'number' ? idVal : Math.floor(Math.random() * 1e9)),
              name:
                typeof titleVal === 'string' && titleVal.trim().length
                  ? titleVal
                  : `Property ${String(idVal ?? '').slice(0, 6)}`,
              lat: lat as number,
              lng: lng as number,
            };
          });
          // eslint-disable-next-line no-console
          console.log('[MagicBento] derived globe locations =', locs.length, locs.slice(0, 5));
          setGlobeLocations(locs);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('[MagicBento] failed to derive globe locations', e);
          setGlobeLocations([]);
        }
      })
      .catch(() => {
        // swallow
      });
  };

  const handleReload = () => {
    // Re-run the last search if available, else no-op
    handleSearch();
  };

  // Execute the quick name search (used by Enter key and search button)
  const executeQuickSearch = async () => {
    const q = (quickQuery ?? '').trim();
    if (!q) return;
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('properties_last_mode', 'name');
        sessionStorage.setItem('properties_last_name_query', q);
      }
    } catch {}
    try {
      const res = await api.get('/property/retrieve-search-by-name', { params: { q } });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('properties:filter-results', { detail: res.data }));
      }
      // Derive globe locations similarly to filter search
      try {
        const list = Array.isArray(res.data) ? (res.data as unknown[]) : [];
        const toNum = (v: unknown): number | null => {
          if (typeof v === 'number' && isFinite(v)) return v;
          if (typeof v === 'string') { const n = parseFloat(v); return isFinite(n) ? n : null; }
          if (v && typeof (v as { toString: () => string }).toString === 'function') { const s = (v as { toString: () => string }).toString(); const n = parseFloat(s); return isFinite(n) ? n : null; }
          return null;
        };
        const getLat = (p: unknown): number | null => {
          const obj = (p ?? {}) as Record<string, unknown>;
          const loc = obj['Location'] as (Record<string, unknown> | undefined);
          const loc2 = obj['location'] as (Record<string, unknown> | undefined);
          return (
            toNum(obj?.['latitude']) ?? toNum(obj?.['lat']) ?? toNum(loc?.['lat']) ?? toNum(loc?.['latitude']) ?? toNum(loc2?.['lat']) ?? toNum(loc2?.['latitude']) ?? null
          );
        };
        const getLng = (p: unknown): number | null => {
          const obj = (p ?? {}) as Record<string, unknown>;
          const loc = obj['Location'] as (Record<string, unknown> | undefined);
          const loc2 = obj['location'] as (Record<string, unknown> | undefined);
          return (
            toNum(obj?.['longitude']) ?? toNum(obj?.['lng']) ?? toNum(obj?.['lon']) ?? toNum(loc?.['lng']) ?? toNum(loc?.['lon']) ?? toNum(loc?.['longitude']) ?? toNum(loc2?.['lng']) ?? toNum(loc2?.['lon']) ?? toNum(loc2?.['longitude']) ?? null
          );
        };
        const candidates = list.map((p) => ({ p, lat: getLat(p), lng: getLng(p) })).filter(({ lat, lng }) => typeof lat === 'number' && typeof lng === 'number');
        const limited = candidates.slice(0, globePageSize);
        const locs: Location[] = limited.map(({ p, lat, lng }) => {
          const obj = (p ?? {}) as Record<string, unknown>;
          const idVal = obj['id'];
          const titleVal = obj['title'];
          return {
            id: typeof idVal === 'string' ? Number(Math.abs(hashCode(idVal))) : (typeof idVal === 'number' ? idVal : Math.floor(Math.random() * 1e9)),
            name: typeof titleVal === 'string' && titleVal.trim().length ? titleVal : `Property ${String(idVal ?? '').slice(0, 6)}`,
            lat: lat as number,
            lng: lng as number,
          };
        });
        setGlobeLocations(locs);
      } catch { setGlobeLocations([]); }
    } catch {
      // swallow
    }
  };

  return (
    <>
      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      {/* Standalone top search bar (outside grid to preserve layout) */}
      <div className="search-bar">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
          <SearchOutlinedIcon sx={{ color: '#003FC7', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Quick search properties..."
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              color: '#000',
              fontSize: '1rem',
              outline: 'none',
              fontFamily: 'inherit',
              padding: '0.5em 0',
            }}
            value={quickQuery}
            onChange={(e) => setQuickQuery(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key !== 'Enter') return;
              await executeQuickSearch();
            }}
          />
          <IconButton aria-label="Search" onClick={executeQuickSearch} sx={{ color: '#003FC7', flexShrink: 0 }}>
            <SearchOutlinedIcon />
          </IconButton>
        </Box>
      </div>

      <BentoCardGrid gridRef={gridRef}>
        {cardData.map((card, index) => {
          const baseClassName = `card ${textAutoHide ? 'card--text-autohide' : ''} ${enableBorderGlow ? 'card--border-glow' : ''}`;
          const cardProps = {
            className: baseClassName,
            style: {
              '--glow-color': glowColor,
            } as React.CSSProperties,
          };

          if (enableStars) {
            return (
              <ParticleCard
                key={index}
                {...cardProps}
                disableAnimations={shouldDisableAnimations}
                particleCount={particleCount}
                glowColor={glowColor}
                enableTilt={enableTilt}
                clickEffect={clickEffect}
                enableMagnetism={enableMagnetism}
              >
                {index === 0 ? (
                  <Box sx={{ p: { xs: 1, md: 2 }, display: 'flex', flexDirection: 'column', gap: { xs: 1.5, md: 2 } }}>
                    <div className="card__header">
                      <div className="card__label">Search Properties</div>
                    </div>
                    <div className="card__content">

                      <Stack spacing={{ xs: 1.5, md: 2 }}>
                        {/* Country search */}
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1, color: 'grey.500' }}>Countries</Typography>
                          <CustomAutocomplete
                            label="Country"
                            value={selectedCountries[0]?.id ?? ''}
                            onChange={(val) => {
                              const country = allCountries.find(c => c.id === val);
                              setSelectedCountries(country ? [{ id: country.id, label: country.name }] : []);
                            }}
                            options={allCountries.map(c => ({ value: c.id, label: c.name }))}
                            placeholder="Select country"
                          />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1, color: 'grey.500' }}>Cities</Typography>
                          <CustomAutocomplete
                            label="City"
                            value={selectedCities[0]?.id ?? ''}
                            onChange={(val) => {
                              const city = allCities.find(c => c.id === val);
                              setSelectedCities(city ? [{ id: city.id, label: city.name }] : []);
                              // Update country if city is selected
                              if (city && city.countryId) {
                                const country = allCountries.find(c => c.id === city.countryId);
                                setSelectedCountries(country ? [{ id: country.id, label: country.name }] : []);
                              }
                            }}
                            options={allCities.map(c => ({ value: c.id, label: c.name }))}
                            placeholder="Select city"
                          />
                        </Box>

                        {/* Budget slider */}
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1, color: 'grey.500' }}>Budget Range</Typography>
                          <Box sx={{ bgcolor: '#fff', borderRadius: { xs: '12px', md: '16px' }, boxShadow: '0 3px 0 #e0e0e0', px: { xs: 2, md: 3 }, py: { xs: 1.5, md: 2 } }}>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                              <MonetizationOnOutlinedIcon sx={{ color: '#003FC7' }} />
                              <Typography sx={{ fontWeight: 400 }}>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(budget[0])} - {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(budget[1])}</Typography>
                            </Stack>
                            <Slider
                              value={budget}
                              onChange={(_, val) => setBudget(val as number[])}
                              valueLabelDisplay="auto"
                              min={0}
                                max={2000000}
                              step={100000}
                              sx={{
                                color: '#003FC7',
                                '& .MuiSlider-thumb': { boxShadow: '0 0 0 4px rgba(0,63,199,0.15)' },
                              }}
                            />
                          </Box>
                        </Box>

                        {/* Investment goals */}
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'grey.500', mb: 1 }}>Investment Goals</Typography>
                          <CheckboxGroup
                            options={goalsExpanded ? goalOptions : goalOptions.slice(0, 2)}
                            values={goals}
                            onChange={setGoals}
                            focusColor="#003FC7"
                          />
                          {goalOptions.length > 2 && (
                            <Box sx={{ mt: 3 }}>
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.5}
                                onClick={() => setGoalsExpanded((prev) => !prev)}
                                sx={{
                                  fontSize: '0.85rem',
                                  color: '#003FC7',
                                  cursor: 'pointer',
                                  fontWeight: 500,
                                  '&:hover': { opacity: 0.8 }
                                }}
                              >
                                <AddIcon sx={{ fontSize: 16 }} />
                                <DiamondIcon sx={{ fontSize: 16 }} />
                                <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                                  {goalsExpanded ? 'Show Less Tags' : `Show More Tags (${goalOptions.length - 2})`}
                                </Typography>
                              </Stack>
                            </Box>
                          )}
                        </Box>

                        {/* Location benefits */}
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'grey.500', mb: 1 }}>Location Benefits</Typography>
                          <CheckboxGroup
                            options={benefitsExpanded ? benefitOptions : benefitOptions.slice(0, 2)}
                            values={benefits}
                            onChange={setBenefits}
                            focusColor="#003FC7"
                          />
                          {benefitOptions.length > 2 && (
                            <Box sx={{ mt: 3, mb:3 }}>
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.5}
                                onClick={() => setBenefitsExpanded((prev) => !prev)}
                                sx={{
                                  fontSize: '0.85rem',
                                  color: '#003FC7',
                                  cursor: 'pointer',
                                  fontWeight: 500,
                                  '&:hover': { opacity: 0.8 }
                                }}
                              >
                                <AddIcon sx={{ fontSize: 16 }} />
                                <DiamondIcon sx={{ fontSize: 16 }} />
                                <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                                  {benefitsExpanded ? 'Show Less Tags' : `Show More Tags (${benefitOptions.length - 2})`}
                                </Typography>
                              </Stack>
                            </Box>
                          )}
                        </Box>
                      
                        <CustomButton
                          color="primary"
                          icon={<SearchOutlinedIcon sx={{ color: '#fff' }} />}
                          label="Search"
                          onClick={handleSearch}
                          fullWidth
                  
                        />
                  
                      </Stack>
                    </div>
                  </Box>
                ) : index === 1 ? (
                  <Box sx={{ p: { xs: 1, md: 2 }, display: 'flex', flexDirection: 'column', gap: { xs: 1.5, md: 2 } }}>
                    <div className="card__header">
                      <div className="card__label">Quick Filters</div>
                    </div>
                    <div className="card__content">
                      <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1, color: 'grey.500' }}>Refined Results</Typography>

                      <Stack spacing={{ xs: 1.5, md: 2 }}>
                        <CustomSelect
                          focusColor="#003FC7"
                          icon={<HomeWorkOutlinedIcon />}
                          selectIcon={KeyboardArrowDownOutlinedIcon}
                          selectedColor="#003FC7"
                          label="Property Type"
                          value={propertyType}
                          onChange={setPropertyType}
                          placeholder="Property type"
                          options={[
                            { value: 'APARTMENT', label: 'Apartment' },
                            { value: 'HOUSE', label: 'House' },
                            { value: 'VILLA', label: 'Villa' },
                            { value: 'STUDIO', label: 'Studio' },
                            { value: 'DUPLEX', label: 'Duplex' },
                          ]}
                        />
                           <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'grey.500' }}>Number of Bedrooms</Typography>
                        <CustomSelect
                          focusColor="#003FC7"
                          icon={<SingleBedOutlinedIcon />}
                          selectIcon={KeyboardArrowDownOutlinedIcon}
                          selectedColor="#003FC7"
                          label="Bedrooms"
                          value={bedrooms}
                          onChange={setBedrooms}
                          placeholder="Bedrooms"
                          options={[
                            { value: 1, label: '1' },
                            { value: 2, label: '2' },
                            { value: 3, label: '3' },
                            { value: 4, label: '4' },
                            { value: '5_PLUS', label: '5+' },
                          ]}
                        />
                      </Stack>
                    </div>
                  </Box>
                ) : index === 2 ? (
                  <Box sx={{ p: { xs: 1, md: 2 }, display: 'flex', flexDirection: 'column', gap: { xs: 1.5, md: 2 } }}>
                    <div className="card__header">
                      <div className="card__label">Performance</div>
                    </div>
                    <div className="card__content">
                      <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1, color: 'grey.500' }}>Property Score</Typography>
                    
                      <Stack spacing={{ xs: 1.5, md: 2 }}>
                        <CustomSelect
                          focusColor="#003FC7"
                          icon={<StarBorderOutlinedIcon />}
                          selectIcon={KeyboardArrowDownOutlinedIcon}
                          selectedColor="#003FC7"
                          label="Score"
                          value={investmentScore}
                          onChange={setInvestmentScore}
                          placeholder="Score"
                          options={Array.from({ length: 11 }, (_, i) => ({ value: i, label: String(i) }))}
                        />
                         <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1, color: 'grey.500' }}>Desired Yield</Typography>
                        <CustomSelect
                          focusColor="#003FC7"
                          icon={<PercentOutlinedIcon />}
                          selectIcon={KeyboardArrowDownOutlinedIcon}
                          selectedColor="#003FC7"
                          label="Expected Yield"
                          value={expectedYield}
                          onChange={setExpectedYield}
                          placeholder="Yield"
                          options={[
                            { value: '1_5', label: '1% - 5%' },
                            { value: '6_10', label: '6% - 10%' },
                            { value: '11_plus', label: '11% +' },
                          ]}
                        />
                      </Stack>
                    </div>
                  </Box>
                ) : (
                  <Box sx={{ p: { xs: 1, md: 2 }, display: 'flex', flexDirection: 'column', gap: { xs: 1.5, md: 2 }, height: '100%' }}>
                    <div className="card__header">
                      <div className="card__label">Global Locations</div>
                    </div>
                    <div className="card__content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <MapGlobeSwitcher locations={globeLocations} onReload={handleReload} onSelect={setSelectedId} />
                      <p className="card__description" style={{ marginTop: 'auto' }}>Explore the locations on map or globe.</p>
                    </div>
                  </Box>
                )}
              </ParticleCard>
            );
          }

          return (
            <div
              key={index}
              {...cardProps}
              ref={(el) => {
                if (!el) return;

                const handleMouseMove = (e: MouseEvent) => {
                  if (shouldDisableAnimations) return;

                  const rect = el.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const centerX = rect.width / 2;
                  const centerY = rect.height / 2;

                  if (enableTilt) {
                    const rotateX = ((y - centerY) / centerY) * -10;
                    const rotateY = ((x - centerX) / centerX) * 10;
                    gsap.to(el, {
                      rotateX,
                      rotateY,
                      duration: 0.1,
                      ease: 'power2.out',
                      transformPerspective: 1000,
                    });
                  }

                  if (enableMagnetism) {
                    const magnetX = (x - centerX) * 0.05;
                    const magnetY = (y - centerY) * 0.05;
                    gsap.to(el, {
                      x: magnetX,
                      y: magnetY,
                      duration: 0.3,
                      ease: 'power2.out',
                    });
                  }
                };

                const handleMouseLeave = () => {
                  if (shouldDisableAnimations) return;

                  if (enableTilt) {
                    gsap.to(el, {
                      rotateX: 0,
                      rotateY: 0,
                      duration: 0.3,
                      ease: 'power2.out',
                    });
                  }

                  if (enableMagnetism) {
                    gsap.to(el, {
                      x: 0,
                      y: 0,
                      duration: 0.3,
                      ease: 'power2.out',
                    });
                  }
                };

                const handleClick = (e: MouseEvent) => {
                  if (!clickEffect || shouldDisableAnimations) return;

                  const rect = el.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;

                  // Calculate the maximum distance from click point to any corner
                  const maxDistance = Math.max(
                    Math.hypot(x, y),
                    Math.hypot(x - rect.width, y),
                    Math.hypot(x, y - rect.height),
                    Math.hypot(x - rect.width, y - rect.height),
                  );

                  const ripple = document.createElement('div');
                  ripple.style.cssText = `
                    position: absolute;
                    width: ${maxDistance * 2}px;
                    height: ${maxDistance * 2}px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
                    left: ${x - maxDistance}px;
                    top: ${y - maxDistance}px;
                    pointer-events: none;
                    z-index: 1000;
                  `;

                  el.appendChild(ripple);

                  gsap.fromTo(
                    ripple,
                    {
                      scale: 0,
                      opacity: 1,
                    },
                    {
                      scale: 1,
                      opacity: 0,
                      duration: 0.8,
                      ease: 'power2.out',
                      onComplete: () => ripple.remove(),
                    },
                  );
                };

                el.addEventListener('mousemove', handleMouseMove);
                el.addEventListener('mouseleave', handleMouseLeave);
                el.addEventListener('click', handleClick);
              }}
            >
              <div className="card__header">
                <div className="card__label">{card.label}</div>
              </div>
              <div className="card__content">
                <h2 className="card__title">{card.title}</h2>
                <p className="card__description">{card.description}</p>
              </div>
            </div>
          );
        })}
      </BentoCardGrid>
    </>
  );
};

export default MagicBento;
