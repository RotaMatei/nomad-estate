import React, { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import CustomButton from '@/app/components/utils/button';
import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined';
import SpinningGlobe from '@/app/reactDevBits/Globe/SpinningGlobe';
import { useTheme, alpha } from '@mui/material/styles';

type Props = {
  onSelect: () => void;
  onPreSelect?: () => void;
  buttonOnly?: boolean;
  buttonLabel?: string;
  paddingTop?: number | string;
  paddingBottom?: number | string;
};

export default function ChooseAgency({ onSelect, onPreSelect, buttonOnly = false, buttonLabel = 'Sign Up', paddingTop = 60, paddingBottom = 28 }: Props) {
  const theme = useTheme();
  const [hoverTick, setHoverTick] = useState(0);
  const [spinTick, setSpinTick] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [shiftTick, setShiftTick] = useState(0);
  const holderRef = useRef<HTMLDivElement | null>(null);

  const baseSize = 250;
  const scale = 6;
  const scaledSize = baseSize * scale;

  const [globeFits, setGlobeFits] = useState(true);
  useEffect(() => {
    const checkFit = () => {
      if (!holderRef.current) return;
      const containerWidth = holderRef.current.offsetWidth;
      setGlobeFits(scaledSize <= containerWidth);
    };

    checkFit();

    const resizeObserver = new ResizeObserver(checkFit);
    if (holderRef.current) resizeObserver.observe(holderRef.current);

    return () => resizeObserver.disconnect();
  }, [scaledSize]);

  const handleHoverStart = useCallback(() => {
    setHoverTick((t) => t + 1);
  }, []);

  if (buttonOnly) {
    return (
      <Box sx={{ position: 'relative', pt: typeof paddingTop === 'number' ? `${paddingTop}px` : paddingTop, pb: typeof paddingBottom === 'number' ? `${paddingBottom}px` : paddingBottom, textAlign: 'center', overflow: 'hidden' }}>
        {/* Oversized globe centered horizontally; only bottom half visible */}
        <Box sx={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0, pointerEvents: 'none' }}>
          <SpinningGlobe
            landColor={'#003FC7'}
            waterColor={'#6FA8FF'}
            autoRotate
            autoRotateSpeed={0.5}
            scale={1.5}
            spinTrigger={spinTick || undefined}
            textureUrl="earth-blue.png"
            style={{ userSelect: 'none', overflow: 'hidden', isolation: 'isolate' }}
          />
          {/* Overlay target globe fades in during spin to avoid blank frame */}
          <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: overlayVisible ? 1 : 0, transition: 'opacity 700ms ease-in-out' }}>
            <SpinningGlobe
              landColor={'#d50000ff'}
              waterColor={'#fd5252'}
              autoRotate
              autoRotateSpeed={0.5}
              scale={1.5}
              textureUrl="earth-red.png"
              spinTrigger={spinTick || undefined}
              style={{ userSelect: 'none', overflow: 'hidden', isolation: 'isolate' }}
            />
          </Box>
        </Box>

        <CustomButton
          color="secondary"
          label={buttonLabel}
          onClick={() => {
            try { onPreSelect?.(); } catch { }
            try {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch { }
            setOverlayVisible(true);
            setShiftTick((t) => t + 1);
            setSpinTick((t) => t + 1);
            // Wait for spin burst, then trigger parent switch
            setTimeout(() => {
              onSelect();
            }, 900);
          }}
          type="button"
          fullWidth={false}
          sx={{
            width: 240,
            mx: 'auto',
            backgroundColor: theme.palette.common.white,
            color: theme.palette.primary.main,
            boxShadow: `0 6px 0 ${alpha(theme.palette.primary.main, 0.35)}`,
            '&:hover': { backgroundColor: theme.palette.grey[100] },
            fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '1rem', lg: '1.125rem' },
            position: 'relative',
            zIndex: 1,
          }}
          icon={<TouchAppOutlinedIcon sx={{ color: theme.palette.primary.main }} />}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{ height: '100%', position: 'relative', overflow: 'hidden', color: '#fff', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', p: 4, width: '100%' }}
      onMouseEnter={handleHoverStart}
      ref={holderRef}
    >
      {/* Globe layer */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          transform: globeFits ? 'translate(-50%, -50%)' : 'translateY(-50%)',
          left: globeFits ? '50%' : 'auto',
          right: globeFits ? 'auto' : 0,
          zIndex: 1,
          pointerEvents: 'none',
          width: `${scaledSize}px`,
          height: `${scaledSize}px`,
        }}
      >
        <SpinningGlobe
          landColor="#003FC7"
          waterColor="#6FA8FF"
          autoRotate
          autoRotateSpeed={0.5}
          scale={scale}
          spinTrigger={hoverTick > 0 ? hoverTick : undefined}
          textureUrl="earth-blue.png"
          style={{
            userSelect: 'none',
            overflow: 'hidden',
            isolation: 'isolate',
          }}
        />
      </Box>

      {/* Text content overlaid on top */}
      <Box sx={{
        width: '100%',
        maxWidth: '100%',
        textAlign: 'center',
        position: 'relative',
        top: '25vh',
        transform: globeFits ? 'translateY(-30%)' : 'translate(-15%, -30%)',
        zIndex: 2,
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        px: 2
      }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            maxWidth: '75%',
            mb: 2,
            fontSize: {
              xs: '1.5rem', // ~24px
              lg: '2rem', // ~32px
            },
          }}
        >
          Do you have an{' '}
          <Box
            component="span"
            sx={{
              display: 'inline',
              fontWeight: 900,
              maxWidth: '75%',
              fontSize: {
                xs: '1.5rem',
                lg: '2rem',
              },
            }}
          >
            Agency
          </Box>
          ?
        </Typography>

        <Typography
          sx={{
            mb: 4,
            opacity: 0.95,
            fontWeight: 700,
            maxWidth: '75%',
            fontSize: {
              xs: '1rem', // ~16px
              lg: '1.25rem', // ~20px
            },
          }}
        >
          Use this button to enroll it on the website and start earning more now.
        </Typography>

        <CustomButton
          color="secondary"
          label="Sign Up"
          onClick={onSelect}
          type="button"
          fullWidth={false}
          sx={{
            width: 240,
            mx: 'auto',
            backgroundColor: theme.palette.common.white,
            color: theme.palette.primary.main,
            boxShadow: `0 6px 0 ${alpha(theme.palette.primary.main, 0.35)}`,
            '&:hover': { backgroundColor: theme.palette.grey[100] },
            fontSize: {
              xs: '0.875rem', // ~14px
              lg: '1.125rem', // ~18px
            },
          }}
          icon={<TouchAppOutlinedIcon sx={{ color: theme.palette.primary.main }} />}
        />

        <Typography
          sx={{
            mt: 3,
            color: '#fff',
            fontStyle: 'italic',
            fontWeight: 400,
            maxWidth: '75%',
            fontSize: {
              xs: '0.875rem',
              lg: '1.125rem',
            },
          }}
        >
          Already have an Agency account?{' '}
          <Link
            href="/login"
            style={{
              fontWeight: 700,
              fontStyle: 'normal',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Log in
          </Link>
        </Typography>
      </Box>

      {/* Decorative SVG aligned exactly with the globe position; fixed intrinsic width */}
      <Box
        component="img"
        src="/ChooseAgency.svg"
        alt=""
        aria-hidden
        sx={{
          position: 'absolute',
          top: 'auto',
          bottom: 0,
          transform: globeFits ? { md: 'translateX(-50%)', lg: 'translateX(-50%)' } : {},
          left: globeFits ? '50%' : 'auto',
          right: globeFits ? 'auto' : '-3%',
          zIndex: 1,
          width: globeFits ? '1500px' : '60vw',
          maxWidth: '1500px',
          height: 'auto',
          maxHeight: '50%',
          pointerEvents: 'none',
          userSelect: 'none',
          display: 'block',
        }}
      />
    </Box>
  );
}