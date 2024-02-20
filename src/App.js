import React from "react";
import AppRoutes from "./AppRoutes";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AppRoutes />
    </ThemeProvider>
  );
};

export default App;
