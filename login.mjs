import inquirer from "inquirer";
import { Amplify, Auth } from "aws-amplify";
import {
  PHONE,
  AWS_REGION,
  AWS_USER_POOL_ID,
  AWS_USER_POOL_WEB_CLIENT_ID,
  STATIC_PASS,
} from "./constants.mjs";

Amplify.configure({
  Auth: {
    region: AWS_REGION,
    userPoolId: AWS_USER_POOL_ID,
    userPoolWebClientId: AWS_USER_POOL_WEB_CLIENT_ID,
    // This is used when autoSignIn is enabled for Auth.signUp
    // 'code' is used for Auth.confirmSignUp, 'link' is used for email link verification
    signUpVerificationMethod: "code",
  },
});

const QUESTIONS = [
  {
    type: "input",
    name: "code",
    message: "What's your authentication code?",
  },
];

const loginResult = await Auth.signIn(PHONE, STATIC_PASS);

const { code } = await inquirer.prompt(QUESTIONS);

await Auth.confirmSignIn(loginResult, code);

console.log(await Auth.currentUserInfo());

const session = await Auth.currentSession();
const jwtToken = session.getAccessToken().getJwtToken();

console.log("The JWT token is: ", jwtToken);
