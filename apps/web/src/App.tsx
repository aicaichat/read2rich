import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion } from 'framer-motion';

// Pages
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import TestChatPage from './pages/TestChatPage';
import EnhancedNewSessionPage from './pages/EnhancedNewSessionPage';
import PreviewPage from './pages/PreviewPage';
import PromptLibraryPage from './pages/PromptLibraryPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import TestAIPage from './pages/TestAIPage';
import TestPromptIntegrationPage from './pages/TestPromptIntegrationPage';
import APIStatusPage from './pages/APIStatusPage';

// Components
import Navbar from './components/Navbar';
import AuthProvider from './contexts/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* 动态背景 */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
                animate={{
                  x: [0, 100, 0],
                  y: [0, -100, 0],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <motion.div
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
                animate={{
                  x: [0, -100, 0],
                  y: [0, 100, 0],
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>

            <Navbar />
            
            <main className="relative z-10">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/chat" element={<EnhancedNewSessionPage />} />
                <Route path="/chat/:sessionId" element={<ChatPage />} />
                <Route path="/test/:sessionId" element={<TestChatPage />} />
                <Route path="/preview/:sessionId" element={<PreviewPage />} />
                <Route path="/prompt-library" element={<PromptLibraryPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/test-ai" element={<TestAIPage />} />
                <Route path="/test-prompt-integration" element={<TestPromptIntegrationPage />} />
                <Route path="/api-status" element={<APIStatusPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App; 