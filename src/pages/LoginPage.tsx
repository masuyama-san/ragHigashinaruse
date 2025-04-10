import React, { useState } from 'react';
import { signIn } from '@aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            await signIn({ username: email, password });
            console.log('ログイン成功');
            // ログイン成功後、チャットページにリダイレクト
            navigate('/chat', { replace: true });
        } catch (err: unknown) {
            // エラーメッセージのカスタマイズ
            let errorMessage = 'ログインに失敗しました。メールアドレスまたはパスワードを確認してください。';
            
            if (err && typeof err === 'object' && 'name' in err) {
                const errorName = (err as { name: string }).name;
                if (errorName === 'UserNotConfirmedException') {
                    errorMessage = 'ユーザーが確認されていません。確認コードを確認してください。';
                } else if (errorName === 'NotAuthorizedException') {
                    errorMessage = 'メールアドレスまたはパスワードが正しくありません。';
                } else if (errorName === 'UserNotFoundException') {
                    errorMessage = 'このメールアドレスに対応するアカウントが見つかりません。';
                }
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold text-center mb-6">ログイン</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            メールアドレス
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            パスワード
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'ログイン中...' : 'ログイン'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;