import { Box, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';

export type Option = { value: string; label: string };

type Props = {
  label?: string;
  options: Option[];
  values: string[];
  onChange: (values: string[]) => void;
  focusColor?: string;
};

export default function CheckboxGroup({ label, options, values, onChange, focusColor = '#e93b20' }: Props) {
  const toggle = (val: string) => {
    const next = values.includes(val) ? values.filter((v) => v !== val) : [...values, val];
    onChange(next);
  };

  return (
    <Box>
      {label && (
        <Typography sx={{ fontWeight: 700, mb: 1, color: grey[500] }}>{label}</Typography>
      )}

      <Box
        sx={{
          bgcolor: '#fff',
          borderRadius: { xs: '12px', md: '16px' },
          boxShadow: `0 6px 0 ${grey[300]}`,
          px: { xs: 2, md: 3 },
          py: { xs: 1.5, md: 2 },
          '&:focus-within': { boxShadow: `0 6px 0 ${focusColor}` },
        }}
      >
        <FormGroup sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1 }}>
          {options.map((o) => (
            <FormControlLabel
              key={o.value}
              label={o.label}
              sx={{ '& .MuiFormControlLabel-label': { color: grey[500] } }}
              control={
                <Checkbox
                  checked={values.includes(o.value)}
                  onChange={() => toggle(o.value)}
                  icon={<CheckBoxOutlineBlankRoundedIcon />}
                  checkedIcon={<CheckBoxRoundedIcon />}
                  sx={{
                    color: grey[500],
                    '&.Mui-checked': {
                      color: '#e93b20',
                    },
                  }}
                />
              }
            />
          ))}
        </FormGroup>
      </Box>
    </Box>
  );
}
