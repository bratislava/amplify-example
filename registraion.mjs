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

await Auth.signUp({
  username: PHONE,
  password: STATIC_PASS,
  // with this enabled, we'd get an active signed in session on Auth right after confirming sign up
  // autoSignIn: {
  //   enabled: true,
  // },
});

const QUESTIONS = [
  {
    type: "input",
    name: "code",
    message: "What's your authentication code?",
  },
];

const { code } = await inquirer.prompt(QUESTIONS);

await Auth.confirmSignUp(PHONE, code);
