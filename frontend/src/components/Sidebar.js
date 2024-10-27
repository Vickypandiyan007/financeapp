import { Link, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import { useState, useEffect } from 'react';
import logo from '../logo.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPowerOff, 
  faTachometerAlt, 
  faUser, 
  faFileAlt, 
  faChartPie, 
  faCog, 
  faUsers,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons'; 
import { getUserPermissions } from '../services/api';

const Sidebar = ({ setIsAuthenticated }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [permissions, setPermissions] = useState({
    can_access_budget_analysis: false,
    can_access_accounts: false,
    can_access_analysis_report: false,
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation(); // Get current path

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const user_id = localStorage.getItem('id');
        if (token) {
          const response = await getUserPermissions(user_id);
          setIsAdmin(response.data.is_admin);
          setPermissions({
            can_access_budget_analysis: response.data.can_access_budget_analysis,
            can_access_accounts: response.data.can_access_accounts,
            can_access_analysis_report: response.data.can_access_analysis_report,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('email');
    localStorage.removeItem('is_admin');

    setIsAuthenticated(false);
    navigate('/login');
  };

  const linkClasses = (path) => 
    `flex items-center ${location.pathname === path ? 'text-Cyan-blue font-semibold' : 'hover:text-Cyan-blue'}`;

  return (
    <div className={`bg-blue-950 text-white w-${isCollapsed ? '16' : '64'} transition-width duration-300 min-h-screen p-4`}>
      <img className={`${isCollapsed ? 'block' : 'hidden'} pt-5`} src={logo} alt="Logo" width={30} />
      <div className="flex items-center justify-between mb-4">
        <h1 className={`text-xl font-bold text-white-200 ${isCollapsed ? 'hidden' : 'block'}`}>Synergy Budget Analysis</h1>
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-white pt-1">
          <FontAwesomeIcon icon={isCollapsed ? faBars : faTimes} className="mr-2 ml-2" />
        </button>
      </div>
      <ul className="mt-4">
        <li className="mb-1">
          <Link to="/dashboard" className={linkClasses('/dashboard')}>
            {!isCollapsed && <FontAwesomeIcon icon={faTachometerAlt} className="mr-2" />}
            {!isCollapsed && 'Dashboard'}
          </Link>
        </li>

        {permissions.can_access_budget_analysis && (
          <li className="mb-1">
            <Link to="/budget-analysis" className={linkClasses('/budget-analysis')}>
              {!isCollapsed && <FontAwesomeIcon icon={faChartPie} className="mr-2" />}
              {!isCollapsed && 'Budget Analysis'}
            </Link>
          </li>
        )}
        
        {permissions.can_access_accounts && (
          <li className="mb-1">
            <Link to="/accounts" className={linkClasses('/accounts')}>
              {!isCollapsed && <FontAwesomeIcon icon={faUsers} className="mr-2" />}
              {!isCollapsed && 'Accounts'}
            </Link>
          </li>
        )}
        
        {permissions.can_access_analysis_report && (
          <li className="mb-1">
            <Link to="/analysis-report" className={linkClasses('/analysis-report')}>
              {!isCollapsed && <FontAwesomeIcon icon={faFileAlt} className="mr-2" />}
              {!isCollapsed && 'Analysis Report'}
            </Link>
          </li>
        )}
        
        {isAdmin && (
          <li className="mb-1">
            <Link to="/admin-console" className={linkClasses('/admin-console')}>
              {!isCollapsed && <FontAwesomeIcon icon={faCog} className="mr-2" />}
              {!isCollapsed && 'Admin Console'}
            </Link>
          </li>
        )}

        <li className="mb-1">
          <Link to="/profile" className={linkClasses('/profile')}>
            {!isCollapsed && <FontAwesomeIcon icon={faUser} className="mr-2" />}
            {!isCollapsed && 'Profile'}
          </Link>
        </li>

        <li className="mt-4">
          <button onClick={handleLogout} className="hover:text-red-800 text-red-500 flex items-center">
            <FontAwesomeIcon icon={faPowerOff} className="ml-1" />
            {!isCollapsed && 'Logout'}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
