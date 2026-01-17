import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to admin dashboard
        navigate('/admin/dashboard', { replace: true });
    }, [navigate]);

    return null;
};

export default Admin;
