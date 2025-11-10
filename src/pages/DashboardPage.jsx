
import Sidebar from '../components/Sidebar';
import NavBar from '../components/Navbar';
import HomePage from './HomePage';
import CollectePage from './CollectePage';
import PlanificationPage from './PlanificationPage';
import  {useState, useEffect} from 'react'
import Users from './Users';
import ClientsPage from './ClientsPage';
import HistoryCollectePage from './HistoryCollectePage';
const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('collecte');

  const getTitleForPage = (page) => {
    const titles = {
      accueil: 'Tableau de bord',
      sites: 'Gestion des sites',
      planification: 'Planification',
      collecte: 'Collecte des données',
      parametres: 'Paramètres',
    };
    return titles[page] || 'Collector';
  };
// Fermer la sidebar au changement de taille d'écran
useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
  };
  
  handleResize(); // Initial check
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
  return (
    <div className="bg-gray-100 min-h-screen flex">
      <Sidebar 
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        <NavBar 
          title={getTitleForPage(activeItem)}
          setSidebarOpen={setSidebarOpen}
        />
        
        <main className="flex-1 overflow-auto">
          {activeItem === 'accueil' && <HomePage />}
          {activeItem === 'collecte' && <CollectePage />}
          {activeItem === 'planification' && <PlanificationPage />}
          {activeItem === 'gestion' && <Users />}
          {activeItem === 'client' && <ClientsPage />}
          {activeItem === 'history' && <HistoryCollectePage />}
        </main>
      </div>
    </div>
  );
};
export default DashboardPage
