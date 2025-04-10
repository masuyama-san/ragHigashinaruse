import amplifyConfig from '../amplify_outputs.json';

const awsExports = {
    Auth: {
        Cognito: {
            userPoolId: amplifyConfig.auth.user_pool_id,
            userPoolClientId: amplifyConfig.auth.user_pool_client_id,
            identityPoolId: amplifyConfig.auth.identity_pool_id,
            loginWith: {
                email: true
            }
        }
    },
    region: amplifyConfig.auth.aws_region
};

export default awsExports;