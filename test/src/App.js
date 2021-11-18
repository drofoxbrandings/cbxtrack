import React from 'react'
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/private-theming';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";


import PrivateRoute from './components/Config/PrivateRoute'
import Login from './components/Authentication/Login'
import ResetPassword from './components/Authentication/ResetPassword.js'
import Dashboard from './components/Dashboard/Dashboard';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#751424',
      light: '#a9454c',
      dark: '#440000'
    },
    secondary: {
      main: '#0f112e',
      light: '#373757',
      dark: '#000006'
    },
    background: {
      default: '#0f112e',
      paper: '#373757',
    },
    text: {
      primary: '#fffbfb',
    },
    error: {
      main: '#f44336',
    },
  },
})

function App() {

  const isAuthenticated = ""
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Login />} />
          <Route path="/forgotPassword" element={ResetPassword} />
          <Route path="/" element={PrivateRoute} isAuthenticated={isAuthenticated}>
            <Route path="/dashboard" element={Dashboard} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
