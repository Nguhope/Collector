import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import Test1 from './pages/test1';
function App() {
  return (
    <Router >
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage/>} />
        <Route path="/topic" element={<Test1/>} />
      </Routes>
    </Router>
  );
}

export default App;