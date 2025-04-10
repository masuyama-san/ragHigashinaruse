import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../utils/auth';

interface LogoutButtonProps {
    className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ className = '' }) => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            const success = await logout();
            if (success) {
                navigate('/login', { replace: true });
            } else {
                alert('ログアウト中にエラーが発生しました。再度お試しください。');
                setIsLoggingOut(false);
            }
        } catch (error) {
            console.error('ログアウトエラー:', error);
            alert('ログアウト中にエラーが発生しました。再度お試しください。');
            setIsLoggingOut(false);
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition ${
                isLoggingOut ? 'opacity-70 cursor-not-allowed' : ''
            } ${className}`}
        >
            {isLoggingOut ? 'ログアウト中...' : 'ログアウト'}
        </button>
    );
};

export default LogoutButton; 