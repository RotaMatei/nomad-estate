import React, { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import './MagicBento.css';
import { Box, Slider, Typography, Stack } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import SingleBedOutlinedIcon from '@mui/icons-material/SingleBedOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import PercentOutlinedIcon from '@mui/icons-material/PercentOutlined';
import { CustomAutocomplete } from '../../components/utils/autocomplete';
import CheckboxGroup, { type Option as CheckboxOption } from '../../components/utils/checkboxGroup';
import CustomButton from '../../components/utils/button';
import api from '../../lib/api';
// Import enums from backend generated types if available; otherwise declare minimal union types locally.
// Assuming no direct prisma types on frontend, we approximate the enums used by /property/retrieve-search.
type InvestmentGoalTagEnum =
  | 'HIGH_ROI'
  | 'CASH_FLOW_POSITIVE'
  | 'SHORT_TERM_RENTAL_READY'
  | 'LONG_TERM_RENTAL_STABLE'
  | 'FIX_AND_FLIP'
  | 'NEW_DEVELOPMENT'
  | 'BELOW_MARKET_VALUE'
  | 'TURNKEY_INVESTMENT'
  | 'MULTI_UNIT'
  | 'STUDENT_HOUSING'
  | 'RETIREMENT_INCOME'
  | 'VACATION_HOME_INCOME'
  | 'COMMERCIAL_CONVERSION';

type LocationBenefitTagEnum =
  | 'TAX_FREE_ZONE'
  | 'LOW_PROPERTY_TAX'
  | 'URBAN_GROWTH_ZONE'
  | 'TOURIST_HOTSPOT'
  | 'NEAR_INFRASTUCTURE_PROJECT'
  | 'ECONOMIC_HUB'
  | 'EXPAT_FRIENDLY'
  | 'GREEN_ZONE'
  | 'HERITAGE_ZONE'
  | 'SAFE_NEIGHBORHOOD'
  | 'SCHOOL_DISTRICT'
  | 'COASTAL_ACCESS'
  | 'MOUNTAIN_VIEW'
  | 'EU_RESIDENCY_ELIGIBLE'
  | 'GOLDEN_VISA';
import { CustomSelect } from '../../components/utils/select';
import { MapGlobeSwitcher } from "../../components/propertyDashComponents/MapGlobeSwitcher";
import { Location } from "../../components/propertyDashComponents/location";

const mockLocations: Location[] = [
  { id: 1, name: "Paris", lat: 48.8566, lng: 2.3522 },
  { id: 2, name: "Berlin", lat: 52.52, lng: 13.405 },
  { id: 3, name: "Tokyo", lat: 35.6762, lng: 139.6503 },
];

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
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  // Filters state (for first card)
  const [country, setCountry] = useState<string | number | ''>('');
  const [budget, setBudget] = useState<number[]>([100000, 500000]);
  const [goals, setGoals] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  // Mobile collapsible state for goals and benefits sections
  const [showGoals, setShowGoals] = useState(true);
  const [showBenefits, setShowBenefits] = useState(true);
  const [countryOptions, setCountryOptions] = useState<{ value: string | number; label: string }[]>([]);
  const [city, setCity] = useState<string | number | ''>('');
  const [cityOptions, setCityOptions] = useState<{ value: string | number; label: string }[]>([]);
  const [propertyType, setPropertyType] = useState<string | number>('');
  const [bedrooms, setBedrooms] = useState<string | number>('');
  const [investmentScore, setInvestmentScore] = useState<string | number>('');
  const [expectedYield, setExpectedYield] = useState<string | number>('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    // Selected location id is tracked
  }, [selectedId]);

  useEffect(() => {
    let cancelled = false;
    const loadCountries = async () => {
      try {
        const { data } = await api.get('/countries/retrieve/get-all');
        if (cancelled) return;
        // Expecting array of Country: { id, name, code, ... }
        type CountryDTO = { id: number | string; name?: string; code?: string };
        const mapped = ((data as CountryDTO[]) || []).map((c) => ({
          value: c.id, // prefer numeric id to match cities API param
          label: c.name ?? String(c.code ?? c.id),
        }));
        setCountryOptions(mapped);
      } catch {
        // Fallback to a minimal list if API fails, to keep UX working
        if (!cancelled) {
          setCountryOptions([
            { value: 'ro', label: 'Romania' },
            { value: 'us', label: 'United States' },
            { value: 'de', label: 'Germany' },
            { value: 'fr', label: 'France' },
          ]);
        }
      }
    };
    loadCountries();
    return () => { cancelled = true; };
  }, []);

  // Load cities when a country is selected
  useEffect(() => {
    let cancelled = false;
    const loadCities = async () => {
      if (!country) {
        setCityOptions([]);
        setCity('');
        return;
      }
      try {
        const { data } = await api.get(`/cities/retrieve/get-all-by-country/${country}`);
        if (cancelled) return;
        type CityDTO = { id: number | string; name?: string };
        const mapped = ((data as CityDTO[]) || []).map((ct) => ({
          value: ct.id,
          label: ct.name ?? String(ct.id),
        }));
        setCityOptions(mapped);
      } catch {
        if (!cancelled) {
          setCityOptions([]);
        }
      }
    };
    loadCities();
    return () => {
      cancelled = true;
    };
  }, [country]);

  const goalOptions: CheckboxOption[] = [
    { value: 'capital_growth', label: 'Capital Appreciation' },
    { value: 'residence_permit', label: 'Residence Permit' },
    { value: 'citizenship', label: 'Citizenship' },
    { value: 'high_roi', label: 'High ROI' },
    { value: 'rental_income', label: 'Rental Income' },
    { value: 'golden_visa', label: 'Golden Visa' },
    { value: 'tax_benefits', label: 'Tax Benefits' },
    { value: 'second_home', label: 'Second Home' },
  ];

  const benefitOptions: CheckboxOption[] = [
    { value: 'transport', label: 'Near Public Transport' },
    { value: 'schools', label: 'Near Schools' },
    { value: 'low_crime', label: 'Low Crime Rate' },
    { value: 'walkability', label: 'High Walkability' },
    { value: 'green', label: 'Green Spaces' },
    { value: 'waterfront', label: 'Waterfront' },
    { value: 'tourist_hotspot', label: 'Tourist Hotspot' },
    { value: 'eu_access', label: 'EU Access' },
  ];

  const handleSearch = () => {
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

    // Map UI selections to backend enums (strongly typed, no any)
    type UiGoal = 'high_roi' | 'rental_income' | 'capital_growth' | 'second_home' | 'golden_visa' | 'tax_benefits';
    type UiBenefit =
      | 'transport' | 'schools' | 'low_crime' | 'walkability'
      | 'green' | 'waterfront' | 'tourist_hotspot' | 'eu_access'
      | 'golden_visa' | 'tax_benefits';

    const invGoalMap: Partial<Record<UiGoal, InvestmentGoalTagEnum>> = {
      high_roi: 'HIGH_ROI',
      rental_income: 'LONG_TERM_RENTAL_STABLE',
      capital_growth: 'NEW_DEVELOPMENT',
      second_home: 'VACATION_HOME_INCOME',
    };
    const locBenefitMap: Partial<Record<UiBenefit, LocationBenefitTagEnum>> = {
      tourist_hotspot: 'TOURIST_HOTSPOT',
      green: 'GREEN_ZONE',
      schools: 'SCHOOL_DISTRICT',
      eu_access: 'EU_RESIDENCY_ELIGIBLE',
      waterfront: 'COASTAL_ACCESS',
      low_crime: 'SAFE_NEIGHBORHOOD',
      transport: 'NEAR_INFRASTUCTURE_PROJECT',
      walkability: 'URBAN_GROWTH_ZONE',
      golden_visa: 'GOLDEN_VISA',
      tax_benefits: 'LOW_PROPERTY_TAX',
    };

    const mappedInvG = (goals || [])
      .map((g) => invGoalMap[g])
      .filter(Boolean);
    const mappedLocB = (
      // merge explicit benefits + any goal entries that are really location benefits
      [...(benefits || []), ...goals.filter((g) => ['golden_visa', 'tax_benefits'].includes(g))]
    )
      .map((b) => locBenefitMap[b])
      .filter(Boolean);

    type FilterBody = {
      minimumPrice?: number;
      maximumPrice?: number;
      location?: number;
      propertyType?: string | number;
      minimumScore?: number;
      minimumYield?: number;
      minimumNoBedrooms?: number;
    };

    const filterBody: FilterBody = {
      minimumPrice: budget?.[0],
      maximumPrice: budget?.[1],
      location: typeof city === 'number' ? city : (typeof city === 'string' && city !== '' && !isNaN(Number(city)) ? Number(city) : undefined),
      propertyType: propertyType || undefined,
      minimumScore: coerceScore(investmentScore),
      minimumYield: coerceYield(expectedYield),
      minimumNoBedrooms: coerceBedrooms(bedrooms),
    };

    // Remove undefined keys to avoid validation errors
    (Object.keys(filterBody) as (keyof FilterBody)[]).forEach((k) => {
      if (filterBody[k] === undefined) delete filterBody[k];
    });

    const queryParams = {
      // Backend normalizes single vs array automatically
      InvG: mappedInvG.length ? mappedInvG : undefined,
      LocB: mappedLocB.length ? mappedLocB : undefined,
    } as const;

    // Persist last search so listings can reconstruct the body on reload
    try {
      if (typeof window !== 'undefined') {
        const toStore = { filterBody, InvG: queryParams.InvG, LocB: queryParams.LocB };
        sessionStorage.setItem('properties_last_search', JSON.stringify(toStore));
      }
    } catch {}

    // Execute request
    console.log('[Properties] REQUEST /property/retrieve-search', {
      url: '/property/retrieve-search',
      method: 'POST',
      params: queryParams,
      body: filterBody,
    });

    api.request({
      method: 'post',
      url: '/property/retrieve-search',
      params: queryParams,
      data: filterBody, // relies on GET body; consider POST if infra blocks this
    })
      .then((res) => {
        // Filter search success
        // Dispatch a custom event so listings page can listen & update without prop drilling
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('properties:filter-results', { detail: res.data }));
        }
      })
      .catch((err) => {
        console.warn('[MagicBento] Filter search failed', err, { filterBody, queryParams });
      });
  };

  const handleReload = () => {
  };
  // Initialize collapsed states depending on breakpoint
  useEffect(() => {
    // Collapse by default on mobile, expand on md+ screens
    setShowGoals(!isMobile);
    setShowBenefits(!isMobile);
  }, [isMobile]);

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
                          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1, color: 'grey.500' }}>Country</Typography>
                          <CustomAutocomplete
                            focusColor="#003FC7"
                            icon={<PlaceOutlinedIcon />}
                            label="Country"
                            value={country}
                            onChange={setCountry}
                            placeholder="Search country"
                            options={countryOptions}
                            selectedColor="#003FC7"
                          />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1, color: 'grey.500' }}>City</Typography>
                          <CustomAutocomplete
                            focusColor="#003FC7"
                            icon={<PlaceOutlinedIcon />}
                            label="City"
                            value={city}
                            onChange={setCity}
                            placeholder="Search city"
                            options={cityOptions}
                            selectedColor="#003FC7"
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
                              step={10000}
                              sx={{
                                color: '#003FC7',
                                '& .MuiSlider-thumb': { boxShadow: '0 0 0 4px rgba(0,63,199,0.15)' },
                              }}
                            />
                          </Box>
                        </Box>

                        {/* Investment goals */}
                        <Box>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'grey.500' }}>Investment Goals</Typography>
                          <KeyboardArrowDownOutlinedIcon
                            onClick={() => setShowGoals((prev) => !prev)}
                            sx={{
                              display: { xs: 'block', sm: 'block', md: 'none' },
                              cursor: 'pointer',
                              transform: showGoals ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s ease',
                              color: 'secondary.main'
                            }}
                          />
                        </Stack>
                        {showGoals && (
                          <CheckboxGroup
                            options={goalOptions}
                            values={goals}
                            onChange={setGoals}
                            focusColor="#003FC7"
                          />
                        )}
                        </Box>

                        {/* Location benefits */}
                         <Box>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'grey.500' }}>Location Benefits</Typography>
                          <KeyboardArrowDownOutlinedIcon
                            onClick={() => setShowBenefits((prev) => !prev)}
                            sx={{
                              display: { xs: 'block', sm: 'block', md: 'none' },
                              cursor: 'pointer',
                              transform: showBenefits ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s ease',
                              color: 'secondary.main'
                            }}
                          />
                        </Stack>
                        {showBenefits && (
                          <CheckboxGroup
                            options={benefitOptions}
                            values={benefits}
                            onChange={setBenefits}
                            focusColor="#003FC7"
                          />
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
                  <>
                    <div className="card">
                      <div className="card__content">
                        <h2 className="card__title">Global Locations</h2>
                        <MapGlobeSwitcher locations={mockLocations} onReload={handleReload} onSelect={setSelectedId} />
                        <p className="card__description">Explore the locations on map or globe.</p>
                      </div>
                    </div>
                  </>
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
