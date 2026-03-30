import { CircularProgress, Box, Typography } from '@mui/joy';

function Spinner({ size = 'xs', message = 'Loading...', color = 'primary.main' }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress size={size} />
      <Typography level="h6" sx={{ mt: 2, fontWeight: 600, color: color }}>
        {message}
      </Typography>
    </Box>
  );
}

export default Spinner;