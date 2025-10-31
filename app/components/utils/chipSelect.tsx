import { Box, Chip, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

export type Option = { value: string; label: string };

type Props = {
  label?: string;
  options: Option[];
  values: string[];
  onChange: (values: string[]) => void;
  focusColor?: string;
};

export default function ChipSelect({
  label,
  options,
  values,
  onChange,
  focusColor = '#e93b20',
}: Props) {
  const toggle = (val: string) => {
    const next = values.includes(val) ? values.filter((v) => v !== val) : [...values, val];
    onChange(next);
  };

  return (
    <Box>
      {label && <Typography sx={{ fontWeight: 700, mb: 1, color: grey[500] }}>{label}</Typography>}
      <Box
        sx={{
          bgcolor: '#fff',
          borderRadius: { xs: '12px', lg: '16px' },
          boxShadow: `0 6px 0 ${grey[300]}`,
          px: { xs: 2, lg: 3 },
          py: { xs: 1.5, lg: 2 },
          '&:focus-within': { boxShadow: `0 6px 0 ${focusColor}` },
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {options.map((o) => (
            <Chip
              key={o.value}
              label={o.label}
              onClick={() => toggle(o.value)}
              color={values.includes(o.value) ? 'primary' : 'default'}
              sx={{
                borderRadius: 2,
                bgcolor: values.includes(o.value) ? focusColor : grey[100],
                color: values.includes(o.value) ? '#fff' : 'text.primary',
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
