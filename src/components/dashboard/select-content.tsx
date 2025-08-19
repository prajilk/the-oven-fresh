'use client';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MuiAvatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MuiListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import Select, {
  type SelectChangeEvent,
  selectClasses,
} from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { useState } from 'react';

const Avatar = styled(MuiAvatar)(({ theme }) => ({
  width: 28,
  height: 28,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  border: `1px solid ${theme.palette.divider}`,
}));

const ListItemAvatar = styled(MuiListItemAvatar)({
  minWidth: 0,
  marginRight: 12,
});

export default function SelectContent() {
  const [company, setCompany] = useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setCompany(event.target.value as string);
  };

  return (
    <Select
      displayEmpty
      fullWidth
      id="company-simple-select"
      inputProps={{ 'aria-label': 'Select company' }}
      labelId="company-select"
      onChange={handleChange}
      sx={{
        maxHeight: 56,
        width: 215,
        '&.MuiList-root': {
          p: '8px',
        },
        [`& .${selectClasses.select}`]: {
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          pl: 1,
        },
      }}
      value={company}
    >
      <ListSubheader sx={{ pt: 0 }}>Stores</ListSubheader>
      <MenuItem value="">
        <ListItemAvatar>
          <Avatar alt="The oven fresh scarborough" className="relative">
            <Image alt="logo" fill src="/logo.webp" />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="The Oven Fresh" secondary="Scarborough" />
      </MenuItem>
      <MenuItem value={10}>
        <ListItemAvatar>
          <Avatar alt="The oven fresh oshawa" className="relative">
            <Image alt="logo" fill src="/logo.webp" />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="The Oven Fresh" secondary="Oshawa" />
      </MenuItem>
      <Divider sx={{ mx: -1 }} />
      <MenuItem value={40}>
        <ListItemIcon>
          <AddRoundedIcon />
        </ListItemIcon>
        <ListItemText primary="Add store" secondary="new store" />
      </MenuItem>
    </Select>
  );
}
