import aws from '../amplify_outputs.json'

const awsExports = {
    aws_project_region: aws.auth.aws_region,
    aws_cognito_region: aws.auth.aws_region,
    aws_user_pools_id: aws.auth.user_pool_id,
    aws_user_pools_web_client_id: aws.auth.user_pool_client_id,
};

export default awsExports;