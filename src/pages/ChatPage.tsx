import React, { useEffect, useState } from 'react';
import LogoutButton from '../components/auth/LogoutButton';
import { getCurrentUser } from '../utils/auth';

interface UserInfo {
    username: string;
    email?: string;
}

const ChatPage: React.FC = () => {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userInfo = await getCurrentUser();
                setUser(userInfo);
            } catch (error) {
                console.error('ユーザー情報取得エラー:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* ヘッダー */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-gray-900">チャット</h1>
                    <div className="flex items-center space-x-4">
                        {user && (
                            <span className="text-sm text-gray-600">
                                こんにちは、{user.username}さん
                            </span>
                        )}
                        <LogoutButton />
                    </div>
                </div>
            </header>

            {/* メインコンテンツ */}
            <main className="flex-grow p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-semibold mb-4">メッセージ</h2>
                        <p>チャットコンテンツがここに表示されます。</p>
                    </div>
                </div>
            </main>

            {/* フッター */}
            <footer className="bg-white shadow-inner py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500">
                        © {new Date().getFullYear()} チャットアプリ
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default ChatPage;
