import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
   
    localStorage.removeItem('user');

    
    navigate('/');
  }, [navigate]);

  return null; // Nothing is displayed, it's just for redirection
}

export default Logout;
