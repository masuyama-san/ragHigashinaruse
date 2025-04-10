import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    redirectPath?: string;
}

/**
 * 認証が必要なルートを保護するコンポーネント
 * 認証されていない場合はリダイレクトする
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    redirectPath = '/login'
}) => {
    const [authChecked, setAuthChecked] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const authenticated = await isAuthenticated();
                setIsAuth(authenticated);
            } catch (error) {
                console.error('認証チェック中にエラーが発生しました:', error);
                setIsAuth(false);
            } finally {
                setAuthChecked(true);
            }
        };
        
        checkAuth();
    }, []);

    // 認証チェック中はローディング表示
    if (!authChecked) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // 認証されていない場合はリダイレクト
    if (!isAuth) {
        return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }

    // 認証されている場合は子コンポーネントを表示
    return <>{children}</>;
}; 