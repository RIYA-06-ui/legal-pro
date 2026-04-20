
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './index.css';
import { DocumentProvider } from './context/DocumentContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Footer from './components/Footer';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { userLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-blue-600 dark:text-blue-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userLoggedIn) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  return children;
}

// Public Route Component (redirects to dashboard if already logged in)
function PublicRoute({ children }) {
  const { userLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-blue-600 dark:text-blue-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (userLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function Layout() {
  const location = useLocation();
  // Show header on all pages except authentication pages
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';
  const isDashboardPage = location.pathname.startsWith('/dashboard');
  const showHeader = !isAuthPage;
  const showFooter = location.pathname === '/';

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 transition-colors">
      {showHeader && <Header />}
      <main className={showHeader && !isDashboardPage ? "pt-20" : ""}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard/analysis"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/documents"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/summary"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/benchmark"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/chat"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/team"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/notifications"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <DocumentProvider>
          <Router>
            <Layout />
          </Router>
        </DocumentProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
