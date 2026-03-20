import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export type SortBy = "time" | "pages";

interface SortDropdownProps {
  value: SortBy;
  onChange: (value: SortBy) => void;
}

function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <FormControl size="small" sx={{ minWidth: 180 }}>
      <InputLabel>Rank by</InputLabel>
      <Select
        value={value}
        label="Rank by"
        onChange={(e) => onChange(e.target.value as SortBy)}
      >
        <MenuItem value="time">Time (fastest)</MenuItem>
        <MenuItem value="pages">Links clicked (least)</MenuItem>
      </Select>
    </FormControl>
  );
}

export default SortDropdown;
