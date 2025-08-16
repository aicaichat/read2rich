import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/config";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import OpportunitiesPage from "./pages/OpportunitiesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import OnboardingPage from "./pages/OnboardingPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import BusinessReportPage from "./pages/BusinessReportPage";
import LanguageTestPage from "./pages/LanguageTestPage";
import AboutPage from "./pages/AboutPage";
import "./index.css";
import ContactPage from "./pages/ContactPage";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <div className="min-h-screen bg-dark-300">
          <Navbar />
          <main className="relative z-10">
            <Routes>
                          <Route path="/" element={<HomePage />} />
            <Route path="/opportunities" element={<OpportunitiesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
                                    <Route path="/onboarding" element={<OnboardingPage />} />
                        <Route path="/recommendations" element={<RecommendationsPage />} />
                        <Route path="/business-report" element={<BusinessReportPage />} />
                        <Route path="/language-test" element={<LanguageTestPage />} />
            {/* Placeholder routes for other pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </I18nextProvider>
  );
}

export default App;
