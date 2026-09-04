import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

import UserRegisterPage from '../pages/UserRegisterPage';
import UserLoginPage from '../pages/UserLoginPage';
import FoodPartnerRegisterPage from '../pages/FoodPartnerRegisterPage';
import FoodPartnerLoginPage from '../pages/FoodPartnerLoginPage';

import UserDataHome from '../pages/general/UserDataHome';
import FoodHome from '../pages/food-partner/FoodHome';
import FoodPartnerProfile from '../pages/general/FoodPartnerProfile';
import UserProfile from '../pages/general/UserProfile';

function AppRoutes() {
  return (
    <Router>
      <Routes>

        <Route
          path="/login"
          element={<Navigate to="/user/login" replace />}
        />

        <Route
          path="/user/register"
          element={<UserRegisterPage />}
        />

        <Route
          path="/user/login"
          element={<UserLoginPage />}
        />

        <Route
          path="/food-partner/register"
          element={<FoodPartnerRegisterPage />}
        />

        <Route
          path="/food-partner/login"
          element={<FoodPartnerLoginPage />}
        />

        {/* USER HOME */}
        <Route
          path="/UserDataHome"
          element={<UserDataHome />}
        />

        {/* FOOD PARTNER HOME */}
        <Route
          path="/FoodHome"
          element={<FoodHome />}
        />

        <Route path="/food-partner/:id" element={<FoodPartnerProfile />} />

       <Route path="/profile" element={<UserProfile />} />

      </Routes>
    </Router>
  );
}

export default AppRoutes;