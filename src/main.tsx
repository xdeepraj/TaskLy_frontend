import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import "./index.css";
import App from "./App.tsx";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { AuthProvider } from "../src/context/AuthContext.tsx";
import { TaskProvider } from "../src/context/TaskContext";

const clientId =
  "57686690463-hfv2lp67t304kpd8iu3qimr8vqlrle6n.apps.googleusercontent.com";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#9c85bb",
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <TaskProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider maxSnack={3}>
              <App />
            </SnackbarProvider>
          </ThemeProvider>
        </TaskProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
