import { fetchAuthSession, signOut } from '@aws-amplify/auth';

/**
 * 現在のユーザーが認証済みかどうかを確認します
 * @returns 認証済みの場合はtrue、それ以外はfalseを返します
 */
export const isAuthenticated = async (): Promise<boolean> => {
    try {
        const session = await fetchAuthSession();
        const { tokens } = session;
        const isAuth = !!tokens && !!tokens.idToken;
        return isAuth;
    } catch {
        return false;
    }
};

/**
 * ログアウト処理を行います
 * @returns ログアウトが成功した場合はtrue、それ以外はfalseを返します
 */
export const logout = async (): Promise<boolean> => {
    try {
        await signOut();
        return true;
    } catch {
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