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
      <Box component="main" flexGrow={1} sx={{ my: 1 }}>
        <Container>
          {finalAccessToken ? (
            <Box sx={{ mt: 2, ml: 0 }}>
              <Typography variant="h4" sx={{ mb: 2 }}>
                Welcome, {finalUserData?.firstname}!
              </Typography>
              <AddTask />
              <Divider sx={{ my: 1 }} />
              <TaskBox />
            </Box>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              textAlign="center"
              minHeight="50vh" // Ensures it has enough height to center properly
            >
              <Typography variant="h4" sx={{ mt: 3 }}>
                Welcome to TaskLy.
              </Typography>
              <Typography variant="h6" sx={{ mt: 3 }}>
                Where you can manage all your current & future tasks.
              </Typography>
              <Typography variant="h6" sx={{ mt: 3 }}>
                and see completed tasks.
              </Typography>
              <Typography variant="h6" sx={{ mt: 3 }}>
                Please login to view your tasks.
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Home;
