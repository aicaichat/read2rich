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
import CourseListPage from './pages/CourseListPage';
import CourseDetailPage from './pages/CourseDetailPage';
import CourseLearningPage from './pages/CourseLearningPage';
import AIRankingPage from './pages/AIRankingPage';
import AIAppDetailPage from './pages/AIAppDetailPage';
import PPTTestPage from './pages/PPTTestPage';
import FullscreenTestPage from './pages/FullscreenTestPage';
import AITrainingCoursePage from './pages/AITrainingCoursePage';
import EnhancedCourseManagement from './pages/EnhancedCourseManagement';
import InstructorProfilePage from './pages/InstructorProfilePage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminCourseManagement from './pages/AdminCourseManagement';
import AdminInstructorManagement from './pages/AdminInstructorManagement';
import AdminUserManagement from './pages/AdminUserManagement';
import AdminOrderManagement from './pages/AdminOrderManagement';
import AdminTestPage from './pages/AdminTestPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminAICrawlerPage from './pages/AdminAICrawlerPage';
import AdminOpportunityFinderPage from './pages/AdminOpportunityFinderPage';
import OpportunityFinderPage from './pages/OpportunityFinderPage';
import AnalysisResultsPage from './pages/AnalysisResultsPage';
import AdminPaymentSettingsPage from './pages/AdminPaymentSettingsPage';
import AdminReportGeneratorPage from './pages/AdminReportGeneratorPage';
import AdminCustomOrdersPage from './pages/AdminCustomOrdersPage';
import AdminEmailSettingsPage from './pages/AdminEmailSettingsPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import PostPurchaseDeliveryPage from './pages/PostPurchaseDeliveryPage';
import AboutPage from './pages/AboutPage';

// Components
import Navbar from './components/Navbar';
import AdminLayout from './components/AdminLayout';
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

            <Routes>
              {/* 前台路由 */}
              <Route path="/" element={
                <>
                  <Navbar />
                  <main className="relative z-10">
                    <LandingPage />
                  </main>
                </>
              } />
              <Route path="/login" element={
                <>
                  <Navbar />
                  <main className="relative z-10">
                    <LoginPage />
                  </main>
                </>
              } />
              <Route path="/oauth-callback" element={
                <main className="relative z-10">
                  <OAuthCallbackPage />
                </main>
              } />
              <Route path="/chat" element={
                <>
                  <Navbar />
                  <main className="relative z-10">
                    <EnhancedNewSessionPage />
                  </main>
                </>
              } />
              <Route path="/chat/:sessionId" element={
                <>
                  <Navbar />
                  <main className="relative z-10">
                    <ChatPage />
                  </main>
                </>
              } />
              <Route path="/test/:sessionId" element={
                <>
                  <Navbar />
                  <main className="relative z-10">
                    <TestChatPage />
                  </main>
                </>
              } />
              <Route path="/preview/:sessionId" element={
                <>
                  <Navbar />
                  <main className="relative z-10">
                    <PreviewPage />
                  </main>
                </>
              } />
              <Route path="/prompt-library" element={
                <>
                  <Navbar />
                  <main className="relative z-10">
                    <PromptLibraryPage />
                  </main>
                </>
              } />
              <Route path="/dashboard" element={
                <>
                  <Navbar />
                  <main className="relative z-10">
                    <DashboardPage />
                  </main>
                </>
              } />
              <Route path="/test-ai" element={
                <>
                  <Navbar />
                  <main className="relative z-10">
                    <TestAIPage />
                  </main>
                </>
              } />
              <Route path="/fullscreen-test" element={
                <>
                  <Navbar />
                  <main className="relative z-10">
                    <FullscreenTestPage />
                  </main>
                </>
              } />
              <Route path="/test-prompt-integration" element={
                <>
                  <Navbar />
                  <main className="relative z-10">
                    <TestPromptIntegrationPage />
                  </main>
                </>
              } />
              <Route path="/api-status" element={
                <>
                  <Navbar />
                  <main className="relative z-10">
                    <APIStatusPage />
                  </main>
                </>
              } />
              <Route path="/courses" element={
                <>
                  <Navbar />
                  <main className="relative z-10">
                    <CourseListPage />
                  </main>
                </>
              } />
              <Route path="/course/1" element={
                <>
                  <Navbar />
                  <main className="relative z-10">
                    <AITrainingCoursePage />
                  </main>
                </>
              } />
              <Route path="/course/:id" element={
                <>
                  <Navbar />
                  <main className="relative z-10">
                    <CourseDetailPage />
                  </main>
                </>
              } />
              <Route path="/course/:id/learn" element={
                <>
                  <Navbar />
                  <main className="relative z-10">
                    <CourseLearningPage />
                  </main>
                </>
              } />
              <Route path="/opportunity-finder" element={
                <>
                  <Navbar />
                  <main className="relative z-10">
                    <OpportunityFinderPage />
                  </main>
                </>
              } />
              <Route path="/ai-ranking" element={
                <>
                  <Navbar />
                  <main className="relative z-10">
                    <AIRankingPage />
                  </main>
                </>
              } />
              <Route path="/about" element={
                <>
                  <Navbar />
                  <main className="relative z-10">
                    <AboutPage />
                  </main>
                </>
              } />
              <Route path="/ppt-test" element={
                <>
                  <Navbar />
                  <main className="relative z-10">
                    <PPTTestPage />
                  </main>
                </>
              } />
              <Route path="/payment/success" element={
                <>
                  <Navbar />
                  <main className="relative z-10">
                    <PostPurchaseDeliveryPage />
                  </main>
                </>
              } />
              <Route path="/delivery" element={
                <>
                  <Navbar />
                  <main className="relative z-10">
                    <PostPurchaseDeliveryPage />
                  </main>
                </>
              } />
              <Route path="/ai-app/:id" element={
                <>
                  <Navbar />
                  <main className="relative z-10">
                    <AIAppDetailPage />
                  </main>
                </>
              } />
              <Route path="/ai-training" element={
                <>
                  <Navbar />
                  <main className="relative z-10">
                    <AITrainingCoursePage />
                  </main>
                </>
              } />
              <Route path="/instructor/:id" element={
                <>
                  <Navbar />
                  <main className="relative z-10">
                    <InstructorProfilePage />
                  </main>
                </>
              } />

              {/* 后台管理路由 */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              } />
              <Route path="/admin/courses" element={
                <AdminLayout>
                  <AdminCourseManagement />
                </AdminLayout>
              } />
              <Route path="/admin/enhanced-courses" element={
                <AdminLayout>
                  <EnhancedCourseManagement />
                </AdminLayout>
              } />
              <Route path="/admin/instructors" element={
                <AdminLayout>
                  <AdminInstructorManagement />
                </AdminLayout>
              } />
              <Route path="/admin/users" element={
                <AdminLayout>
                  <AdminUserManagement />
                </AdminLayout>
              } />
              <Route path="/admin/orders" element={
                <AdminLayout>
                  <AdminOrderManagement />
                </AdminLayout>
              } />
              <Route path="/admin/test" element={
                <AdminLayout>
                  <AdminTestPage />
                </AdminLayout>
              } />
              <Route path="/admin/ai-crawler" element={
                <AdminLayout>
                  <AdminAICrawlerPage />
                </AdminLayout>
              } />
              <Route path="/admin/opportunity-finder" element={
                <AdminLayout>
                  <AdminOpportunityFinderPage />
                </AdminLayout>
              } />
              <Route path="/admin/payment-settings" element={
                <AdminLayout>
                  <AdminPaymentSettingsPage />
                </AdminLayout>
              } />
              <Route path="/admin/email-settings" element={
                <AdminLayout>
                  <AdminEmailSettingsPage />
                </AdminLayout>
              } />
              <Route path="/admin/report-generator" element={
                <AdminLayout>
                  <AdminReportGeneratorPage />
                </AdminLayout>
              } />
              <Route path="/admin/custom-orders" element={
                <AdminLayout>
                  <AdminCustomOrdersPage />
                </AdminLayout>
              } />
              <Route path="/analysis-results" element={
                <AnalysisResultsPage />
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App; 