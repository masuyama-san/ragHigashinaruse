import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';

interface PublicRouteProps {
    children: React.ReactNode;
    redirectAuthenticated?: boolean;
    redirectPath?: string;
}

/**
 * 公開ルート用のコンポーネント
 * 認証済みユーザーをリダイレクトする
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({
    children,
    redirectAuthenticated = true,
    redirectPath = '/chat'
}) => {
    const [authChecked, setAuthChecked] = useState(false);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const authenticated = await isAuthenticated();
                setIsAuth(authenticated);
            } catch {
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

    // 認証済みユーザーをリダイレクト（オプション）
    if (isAuth && redirectAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    // それ以外の場合は子コンポーネントを表示
    return <>{children}</>;
}; 