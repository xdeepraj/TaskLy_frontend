import { Box, Typography, useTheme } from "@mui/material";

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      color="secondary"
      sx={{
        backgroundColor: theme.palette.secondary.main,
        color: "white",
        textAlign: "center",
        py: 1,
        mt: "auto",
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} TaskLy
      </Typography>
    </Box>
  );
};

export default Footer;
