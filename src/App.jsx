import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import Dashboard from './features/dashboard/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />  {/* Home route */}
          <Route path="/" element={<LoginPage />} />
          <Route path='/dashboard' element={<Dashboard/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
