import React from 'react';
import { Card, Stack, Typography, AspectRatio, ListItemContent } from '@mui/joy';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import iuiu_logo from '/iuiu.jpg';

const EventCard = ({ title, startDate, dueDate, status, on, sx = [] }) => {
  // Determine what to display based on status
  const showDueDate = (status === 'open' || status === 'upcoming');
  const showStartDate = (status === 'upcoming');
  const showonDate = (status === 'closed');

  return (
    <Card
      variant="outlined"
      sx={[
        {
          mb: 2,
          width: 250,
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 'md',
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Stack spacing={2}>
        <AspectRatio variant="outlined" ratio="4/3">
          <img src={iuiu_logo} alt={title} className="w-2" />
        </AspectRatio>
        <ListItemContent>
          <Typography level="title-sm" noWrap>
            {title}
          </Typography>
        </ListItemContent>
        <Stack direction="column" spacing={1}>
          {showDueDate && (
            <Typography
              level="body-xs"
              startDecorator={<CalendarMonthOutlinedIcon />}
            >
              Due: {new Date(dueDate).toLocaleDateString()}
            </Typography>
          )}
          {showStartDate && (
            <Typography
              level="body-xs"
              startDecorator={<CalendarMonthOutlinedIcon />}
            >
              Start: {new Date(startDate).toLocaleDateString()}
            </Typography>
          )}
          {on && (
            <Typography
              level="body-xs"
              startDecorator={<CalendarMonthOutlinedIcon />}
            >
              On: {new Date(on).toLocaleDateString()}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Card>
  );
};

export default EventCard;