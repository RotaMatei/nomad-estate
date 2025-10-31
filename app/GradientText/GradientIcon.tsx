'use client';
import React, { useId } from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';

type Props = {
  /** Provide an SvgIcon element, e.g., <MailOutlineIcon fontSize="inherit" /> */
  icon: React.ReactElement<SvgIconProps>;
  colors?: string[];
  speed?: number; // seconds
  size?: number; // px
  className?: string;
  style?: React.CSSProperties;
};

/**
 * GradientIcon applies an animated SVG linearGradient to the provided SvgIcon
 * by cloning its path children and setting fill to url(#...).
 */
export default function GradientIcon({
  icon,
  colors = ['#40ffaa', '#4079ff', '#40ffaa'],
  speed = 6,
  size = 20,
  className,
  style,
}: Props) {
  const id = useId().replace(/:/g, '');

  // Pull original children from the provided icon (typically one <path/>)
  const origChildren = (icon.props as any).children;
  const childrenArray = Array.isArray(origChildren) ? origChildren : [origChildren];

  const paintedChildren = childrenArray.filter(Boolean).map((child: any, idx: number) =>
    // Apply gradient to both fill and stroke, so outlined icons (stroke-based) are also painted
    React.cloneElement(child, {
      key: idx,
      fill: `url(#${id})`,
      stroke: `url(#${id})`,
    }),
  );

  // Clone the icon to inject <defs> and recolored children
  const cloned = React.cloneElement(
    icon,
    {
      fontSize: icon.props.fontSize ?? 'inherit',
      sx: { width: size, height: size, ...(icon.props.sx || {}) },
      className,
      style,
      viewBox: icon.props.viewBox || '0 0 24 24',
    },
    [
      <defs key="defs">
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors[0]}>
            <animate
              attributeName="offset"
              values="-2; 1; -2"
              dur={`${speed}s`}
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="50%" stopColor={colors[Math.min(1, colors.length - 1)]}>
            <animate
              attributeName="offset"
              values="-1; 2; -1"
              dur={`${speed}s`}
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor={colors[Math.min(2, colors.length - 1)]}>
            <animate
              attributeName="offset"
              values="0; 3; 0"
              dur={`${speed}s`}
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
      </defs>,
      ...paintedChildren,
    ],
  );

  return cloned;
}
