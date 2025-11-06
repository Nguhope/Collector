import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

function App() {
  return (
    <Router >
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage/>} />
        
      </Routes>
    </Router>
  );
}

export default App;