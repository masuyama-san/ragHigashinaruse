import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import { PublicRoute } from './components/auth/PublicRoute';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
      <Routes>
        <Route
          path="/" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
        <Route
          path="/chat" element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } />
      </Routes>
  );
}

export default App;