import React, { useState } from 'react';
import { signIn, confirmSignIn, fetchAuthSession } from '@aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

interface SignInResult {
    isSignedIn: boolean;
    nextStep?: {
        signInStep: string;
    };
}

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [signInData, setSignInData] = useState<SignInResult | null>(null);
    
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            console.log('ログイン試行中...');
            const signInResult = await signIn({ username: email, password });
            console.log('ログイン成功:', JSON.stringify(signInResult, null, 2));
            
            // 新しいパスワードの設定が必要かどうかをチェック
            if (signInResult.nextStep && 
                signInResult.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
                console.log('新しいパスワードの設定が必要です');
                setSignInData(signInResult);
                setShowNewPasswordForm(true);
                setLoading(false);
                return;
            }
            
            // セッションを明示的に取得して確認
            console.log('セッショントークン取得試行中...');
            const sessionResult = await fetchAuthSession();
            console.log('セッション取得結果:', JSON.stringify(sessionResult, null, 2));
            
            const { tokens } = sessionResult;
            
            if (tokens && tokens.idToken) {
                console.log('認証トークンを取得しました:', tokens.idToken);
                
                // トークン情報を出力（機密情報は除外）
                console.log('トークン有効期限:', tokens.idToken.payload.exp);
                
                // 少し遅延させてからリダイレクト（トークンの処理時間を考慮）
                setTimeout(() => {
                    console.log('チャットページにリダイレクトします');
                    navigate('/chat', { replace: true });
                }, 1000); // タイムアウトを1秒に増やす
            } else {
                console.error('認証トークンが取得できませんでした');
                setError('認証エラーが発生しました。ページをリロードして再度お試しください。');
                setLoading(false);
            }
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
            if (!showNewPasswordForm) {
                setLoading(false);
            }
        }
    };

    const handleNewPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            if (!signInData) {
                throw new Error('サインインデータがありません');
            }
            
            console.log('新しいパスワードを設定中...');
            await confirmSignIn({
                challengeResponse: newPassword
            });
            
            console.log('パスワード設定成功、セッショントークン取得試行中...');
            const sessionResult = await fetchAuthSession();
            console.log('セッション取得結果:', JSON.stringify(sessionResult, null, 2));
            
            const { tokens } = sessionResult;
            
            if (tokens && tokens.idToken) {
                console.log('認証トークンを取得しました');
                setTimeout(() => {
                    console.log('チャットページにリダイレクトします');
                    navigate('/chat', { replace: true });
                }, 1000);
            } else {
                console.error('認証トークンが取得できませんでした');
                setError('認証エラーが発生しました。ページをリロードして再度お試しください。');
            }
        } catch (err: unknown) {
            console.error('パスワード設定エラー:', err);
            let errorMessage = '新しいパスワードの設定に失敗しました。';
            
            if (err && typeof err === 'object' && 'message' in err) {
                errorMessage += ' ' + (err as { message: string }).message;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // 新しいパスワード設定フォームを表示
    if (showNewPasswordForm) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-2xl font-bold text-center mb-6">新しいパスワードの設定</h1>
                    <p className="mb-4 text-gray-600">初回ログイン時は新しいパスワードの設定が必要です。</p>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleNewPasswordSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                新しいパスワード
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? '設定中...' : 'パスワードを設定'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

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