import React from 'react';
import { useRouter } from 'next/navigation';
import { formatMoney, formatEnumLabel } from '@/app/lib/format';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Button,
  Stack,
} from '@mui/material';
// imageData now comes as a direct URL string from the backend

// Interfaces
interface PropertyPictureDto {
  id: string;
  propertyId: string;
  imageData: string;
  altText?: string | null;
  isPrimary: boolean;
}

interface InvestmentGoalTagDto {
  investmentGoalTag: string;
}

interface LocationBenefitTagDto {
  locationBenefitTag: string;
}

export interface PropertySummaryCardProps {
  property: {
    id: string;
    title: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    totalArea: number;
    yield: number;
    score: number;
    propertyPictures?: PropertyPictureDto[];
    propertyInvestmentGoalTags?: InvestmentGoalTagDto[];
    propertyLocationBenefitTags?: LocationBenefitTagDto[];
    cityName?: string;
    countryName?: string;
  };
  onViewDetails?: (id: string) => void;
}

// Component
const RealEstateCard: React.FC<PropertySummaryCardProps> = ({ property, onViewDetails }) => {
  const router = useRouter();
  const pics = property.propertyPictures || (property as unknown as { picture?: PropertyPictureDto[] }).picture || [];

  // Build an array of image URLs (primary first if available), fallback to one placeholder
  const urls = React.useMemo(() => {
    const ordered = [...pics].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
    const list = ordered
      .map((p) => (typeof p.imageData === 'string' ? p.imageData.trim() : ''))
      .filter((s) => s.length > 0);
    return list.length > 0 ? list : ['/dubai4.jpg'];
  }, [pics]);

  const [index, setIndex] = React.useState(0);
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const dragStartX = React.useRef(0);
  const [dragDeltaX, setDragDeltaX] = React.useState(0);
  const dragMovedRef = React.useRef(false); // used to suppress click after a drag

  const endDrag = React.useCallback(() => {
    if (!dragging) return;
    const width = viewportRef.current?.clientWidth ?? 1;
    const thresholdPx = Math.max(48, width * 0.15); // 15% or 48px minimum
    const dx = dragDeltaX;
    let next = index;
    if (dx <= -thresholdPx && index < urls.length - 1) {
      next = index + 1; // dragged left -> next slide
    } else if (dx >= thresholdPx && index > 0) {
      next = index - 1; // dragged right -> previous slide
    }
    setIndex(next);
    setDragging(false);
    setDragDeltaX(0);
  }, [dragging, dragDeltaX, index, urls.length]);

  const tags = React.useMemo(() => (
    [
      ...(property.propertyInvestmentGoalTags || []).map((t) => t.investmentGoalTag),
      ...(property.propertyLocationBenefitTags || []).map((t) => t.locationBenefitTag),
    ]
      .map(formatEnumLabel)
      .filter(Boolean)
  ), [property.propertyInvestmentGoalTags, property.propertyLocationBenefitTags]);

  // Compute which tags fit in one line without cutting a chip; if none fit, show only the first tag
  const tagRowRef = React.useRef<HTMLDivElement | null>(null);
  const measureRef = React.useRef<HTMLDivElement | null>(null);
  const [visibleTags, setVisibleTags] = React.useState<string[]>([]);
  const [tagContainerWidth, setTagContainerWidth] = React.useState<number>(0);

  // Keep width in state and only recompute fitting when width or tags change
  React.useEffect(() => {
    const el = tagRowRef.current;
    if (!el) return;
    const updateWidth = () => setTagContainerWidth(el.clientWidth || 0);
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(el);
    window.addEventListener('resize', updateWidth);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const arraysEqual = (a: string[], b: string[]) => {
    if (a === b) return true;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  };

  React.useLayoutEffect(() => {
    const container = tagRowRef.current;
    const measurer = measureRef.current;
    if (!container || !measurer || !tags.length) {
      const next = tags.slice(0, 1);
      if (!arraysEqual(next, visibleTags)) setVisibleTags(next);
      return;
    }
    const containerWidth = tagContainerWidth;
    if (!containerWidth) {
      const next = tags.slice(0, 1);
      if (!arraysEqual(next, visibleTags)) setVisibleTags(next);
      return;
    }

  const style = getComputedStyle(measurer) as CSSStyleDeclaration;
  const gapStr = style.columnGap || style.getPropertyValue('column-gap') || '0';
    const gapPx = parseFloat(gapStr) || 0;
    const children = Array.from(measurer.children) as HTMLElement[];
    let used = 0;
    let count = 0;
    for (let i = 0; i < children.length; i++) {
      const w = children[i].offsetWidth;
      const nextUsed = used + (count > 0 ? gapPx : 0) + w;
      if (nextUsed <= containerWidth) {
        count++;
        used = nextUsed;
      } else {
        break;
      }
    }
    const next = count === 0 ? tags.slice(0, 1) : tags.slice(0, count);
    if (!arraysEqual(next, visibleTags)) setVisibleTags(next);
  }, [tags, tagContainerWidth]);

  const priceFormatted = React.useMemo(() => formatMoney(property.price, '$'), [property.price]);
  const locationDisplay = [property.cityName, property.countryName].filter(Boolean).join(', ') || 'Unknown';

  return (
    <Card sx={{ width: '100%', borderRadius: 4, boxShadow: 'none', backgroundColor: 'background.default' }}>
      <Box sx={{ position: 'relative' }}>
        {/* Carousel viewport */}
        <Box
          ref={viewportRef}
          onPointerDown={(e) => {
            e.preventDefault();
            try { (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId); } catch {}
            setDragging(true);
            dragStartX.current = e.clientX;
            setDragDeltaX(0);
            dragMovedRef.current = false;
          }}
          onPointerMove={(e) => {
            if (!dragging) return;
            e.preventDefault();
            let dx = e.clientX - dragStartX.current;
            // Clamp outward drag at edges: prevent any visual shift beyond first/last slide
            if ((index === 0 && dx > 0) || (index === urls.length - 1 && dx < 0)) {
              dx = 0;
            }
            if (Math.abs(dx) > 3) dragMovedRef.current = true;
            setDragDeltaX(dx);
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            endDrag();
          }}
          onPointerCancel={(e) => {
            e.preventDefault();
            endDrag();
          }}
          onClickCapture={(e) => {
            // If a drag occurred, suppress the resulting click so wrappers/links don't trigger
            if (dragMovedRef.current) {
              e.preventDefault();
              e.stopPropagation();
              dragMovedRef.current = false;
            }
          }}
          sx={{
            width: '100%',
            height: 200,
            overflow: 'hidden',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            touchAction: 'pan-y',
            userSelect: 'none',
            cursor: urls.length > 1 ? (dragging ? 'grabbing' : 'grab') : 'default',
          }}
        >
          {/* Track */}
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              height: '100%',
              transform: (() => {
                const w = viewportRef.current?.clientWidth ?? 1;
                const offsetPct = (dragDeltaX / w) * 100; // negative when dragging left
                return `translateX(calc(-${index * 100}% + ${offsetPct}%))`;
              })(),
              transition: dragging ? 'none' : 'transform 600ms ease',
            }}
          >
            {urls.map((src, i) => (
              <Box
                key={i}
                component="img"
                src={src}
                alt={property.title}
                sx={{
                  flex: '0 0 100%',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                draggable={false}
                onError={(e) => {
                  // Replace broken image with fallback for this slide
                  (e.currentTarget as HTMLImageElement).src = '/dubai4.jpg';
                }}
              />
            ))}
          </Box>
        </Box>
        <Chip
          label={`Score: ${property.score}`}
          color="success"
          size="small"
          sx={{ position: 'absolute', top: 8, right: 8 }}
        />
        {/* Page indicator bottom-right */}
        <Chip
          label={`${Math.min(index + 1, urls.length)} / ${urls.length}`}
          size="small"
          sx={{ position: 'absolute', bottom: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', color: 'white' }}
        />
      </Box>

      <CardContent sx={{ px: 2, py: 1, backgroundColor: 'background.default' }}>
        <Typography
          variant="h6"
          noWrap
          sx={{ fontWeight: 600, maxWidth: '100%' }}
        >
          {property.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          noWrap
          sx={{ maxWidth: '100%' }}
        >
          {locationDisplay}
        </Typography>

        <Typography
          variant="h5"
          noWrap
          sx={{ mt: 1, color: 'primary.main', fontWeight: 700, maxWidth: '100%' }}
        >
          {priceFormatted}
        </Typography>

        <Box
          sx={{
            mt: 1,
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: 2,
            rowGap: 0.5,
          }}
        >
          <Typography variant="body2" noWrap sx={{ flex: '0 0 auto', whiteSpace: 'nowrap' }}>
            {property.bedrooms} beds
          </Typography>
          <Typography variant="body2" noWrap sx={{ flex: '0 0 auto', whiteSpace: 'nowrap' }}>
            {property.bathrooms} bathrooms
          </Typography>
          <Typography variant="body2" noWrap sx={{ flex: '0 0 auto', whiteSpace: 'nowrap' }}>
            {property.totalArea}m²
          </Typography>
        </Box>

        <Typography
          variant="body2"
          noWrap
          sx={{ mt: 1, maxWidth: '100%' }}
        >
          Expected yield{' '}
          <Box component="span" sx={{ color: 'green', fontWeight: 600 }}>
            {property.yield}%
          </Box>
        </Typography>

        <Box
          sx={{
            mt: 1,
            display: 'flex',
            flexWrap: 'nowrap',
            gap: 0.5,
            overflow: 'hidden',
            width: '100%',
            alignItems: 'center',
            // maintain a consistent single-line height even with no tags
            minHeight: 28,
          }}
          ref={tagRowRef}
        >
          {visibleTags.map((t) => (
            <Chip
              key={t}
              label={t}
              size="small"
              sx={{ flex: '0 0 auto', maxWidth: visibleTags.length === 1 ? '100%' : 'none' }}
            />
          ))}
        </Box>
        {/* Hidden measurer for tag widths */}
        {tags.length > 0 && (
          <Box
            ref={measureRef}
            sx={{
              position: 'absolute',
              visibility: 'hidden',
              pointerEvents: 'none',
              height: 0,
              overflow: 'hidden',
              display: 'flex',
              flexWrap: 'nowrap',
              gap: 0.5,
              whiteSpace: 'nowrap',
              width: '100%',
            }}
          >
            {tags.map((t) => (
              <Chip key={`measure-${t}`} label={t} size="small" sx={{ flex: '0 0 auto' }} />
            ))}
          </Box>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, borderRadius: 2 }}
          onClick={() => {
            // Prefer passed handler, fallback to router navigation
            if (onViewDetails) {
              onViewDetails(property.id);
            } else {
              router.push(`/details/${property.id}`);
            }
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default RealEstateCard;