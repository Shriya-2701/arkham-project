import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/Layout";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Dashboard from "./components/dashboard/Dashboard";
import Contact from "./components/sections/Contact";
import Social from "./components/socials/Social";
import Edtech from "./components/edtech/Edtech";
import "./index.css";
import ProtectedRoute from "./components/ProtectedRoute";
import Library from "./components/edtech/pages/Library";
import AdminDashboard from "./components/edtech/pages/AdminDashboard";

function App() {
  return (
    
    <ThemeProvider>
      <BrowserRouter basename="/">

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Layout />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}><AdminDashboard/></ProtectedRoute>
          }/>
          <Route path="/contact" element={<Contact />} />
          <Route path="/social/*" element={<Social />} />
          <Route path="/edtech/*" element={<Edtech />} />
          <Route path="library" element={<Library/>}/>
          <Route index element={<Dashboard/>}>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
    
  );
}

export default App;
