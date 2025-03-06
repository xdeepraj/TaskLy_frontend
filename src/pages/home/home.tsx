import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

import Navbar from "../../components/navbar/navbar";
import AddTask from "../../components/addTask/addTask";
import TaskBox from "../../components/taskBox/taskBox";
import Footer from "../../components/footer/footer";

import { Box, Divider, Typography, Container } from "@mui/material";

const Home = () => {
  const { accessToken, userData } = useAuth();
  const [storedAccessToken, setStoredAccessToken] = useState<string | null>(
    null
  );
  const [storedUserData, setStoredUserData] = useState<{
    firstname?: string;
    email?: string;
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("userData");

    if (token) {
      setStoredAccessToken(token);
    }
    if (user) {
      setStoredUserData(JSON.parse(user));
    }
  }, []);

  const finalAccessToken = accessToken || storedAccessToken;
  const finalUserData = userData || storedUserData;

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />

      {/* Main Content */}
      <Box component="main" flexGrow={1} sx={{ mx: 1, my: 1 }}>
        <Container>
          {finalAccessToken ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h4" sx={{ mb: 2 }}>
                Welcome, {finalUserData?.firstname}!
              </Typography>
              <AddTask />
              <Divider sx={{ my: 1 }} />
              <TaskBox />
            </Box>
          ) : (
            <Typography variant="h6" sx={{ mt: 3 }}>
              Hi
            </Typography>
          )}
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Home;
