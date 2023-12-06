import inquirer from "inquirer";
import { Amplify } from "aws-amplify";
import {
  signIn,
  confirmSignIn,
  getCurrentUser,
  fetchAuthSession,
} from "aws-amplify/auth";
import {
  PHONE,
  AWS_REGION,
  AWS_USER_POOL_ID,
  AWS_USER_POOL_WEB_CLIENT_ID,
  STATIC_PASS,
} from "./constants.mjs";

Amplify.configure({
  Auth: {
    Cognito: {
      region: AWS_REGION,
      userPoolId: AWS_USER_POOL_ID,
      userPoolClientId: AWS_USER_POOL_WEB_CLIENT_ID,
      signUpVerificationMethod: "code",
    },
  },
});

const QUESTIONS = [
  {
    type: "input",
    name: "code",
    message: "What's your authentication code?",
  },
];

try {
  const loginResult = await signIn({
    username: PHONE,
    ...(PHONE === "+42100000000"
      ? { options: { authFlowType: "CUSTOM_WITHOUT_SRP" } }
      : { password: STATIC_PASS }),
  });

  console.log(loginResult);

  if (PHONE !== "+42100000000") {
    const { code } = await inquirer.prompt(QUESTIONS);
    // 519234
    await confirmSignIn({ challengeResponse: code });
  }

  console.log(await getCurrentUser());

  const session = await fetchAuthSession();
  const jwtToken = session.tokens.accessToken.toString();

  console.log("The JWT token is: ", jwtToken);
} catch (error) {
  console.log("error", error);
}
