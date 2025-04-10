import { fetchAuthSession } from '@aws-amplify/auth';

/**
 * 現在のユーザーが認証済みかどうかを確認します
 * @returns 認証済みの場合はtrue、それ以外はfalseを返します
 */
export const isAuthenticated = async (): Promise<boolean> => {
    try {
        console.log('認証状態をチェック中...');
        const { tokens } = await fetchAuthSession();
        const isAuth = !!tokens && !!tokens.idToken;
        console.log('認証状態:', isAuth, tokens);
        return isAuth;
    } catch (error) {
        console.error('認証チェックエラー:', error);
        return false;
    }
};

/**
 * 現在のユーザー情報を取得します
 * @returns ユーザー情報（ユーザー名、メールアドレスなど）
 */
export const getCurrentUser = async () => {
    try {
        const { tokens } = await fetchAuthSession();
        if (!tokens || !tokens.idToken) {
            return null;
        }
        
        // JWTトークンからユーザー情報を取得
        const payload = tokens.idToken.toString().split('.')[1];
        const decodedPayload = atob(payload);
        const userData = JSON.parse(decodedPayload);
        
        return {
            username: userData.email || userData.username || 'ユーザー',
            email: userData.email,
        // 他に必要な情報があれば追加
        };
    } catch {
        return null;
    }
}; 