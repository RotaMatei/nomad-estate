import React, { useEffect, useRef, useState } from 'react';
import './Glare.css';

interface GlareProps {
  width?: string;
  height?: string;
  background?: string;
  borderRadius?: string;
  borderColor?: string;
  children?: React.ReactNode;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number; // percentage (0-100 or higher)
  transitionDuration?: number; // ms
  className?: string;
  style?: React.CSSProperties;
  shouldPlay?: boolean; // when this goes from false -> true, play once
}

const Glare: React.FC<GlareProps> = ({
  width = 'auto',
  height = 'auto',
  background = 'transparent',
  borderRadius = '16px',
  borderColor = 'transparent',
  children,
  glareColor = '#ffffff',
  glareOpacity = 0.5,
  glareAngle = -45,
  glareSize = 250,
  transitionDuration = 650,
  className = '',
  style = {},
  shouldPlay = false,
}) => {
  const hex = glareColor.replace('#', '');
  let rgba = glareColor;
  if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  } else if (/^[0-9A-Fa-f]{3}$/.test(hex)) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  }

  const vars: React.CSSProperties & { [k: string]: string } = {
    '--gh-width': width,
    '--gh-height': height,
    '--gh-bg': background,
    '--gh-br': borderRadius,
    '--gh-angle': `${glareAngle}deg`,
    '--gh-duration': `${transitionDuration}ms`,
    '--gh-size': `${glareSize}%`,
    '--gh-rgba': rgba,
    '--gh-border': borderColor
  };

  const [run, setRun] = useState(false);
  const prev = useRef(shouldPlay);
  useEffect(() => {
    if (!prev.current && shouldPlay) {
      // Rising edge: trigger animation
      setRun(true);
      const t = setTimeout(() => setRun(false), transitionDuration + 50);
      prev.current = shouldPlay;
      return () => clearTimeout(t);
    }
    prev.current = shouldPlay;
  }, [shouldPlay, transitionDuration]);

  return (
    <div
      className={`glare ${className}`}
      data-run={run ? 'true' : 'false'}
      style={{ ...vars, display: 'inline-grid', ...style } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default Glare;
