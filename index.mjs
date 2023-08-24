import { Amplify, Auth } from "aws-amplify";

Amplify.configure({
  Auth: {
    region: "eu-central-1",
    userPoolId: "eu-central-1_pXpE6zBM0",
    userPoolWebClientId: "2f8othmrjillbteieffsknuh1e",
    // This is used when autoSignIn is enabled for Auth.signUp
    // 'code' is used for Auth.confirmSignUp, 'link' is used for email link verification
    signUpVerificationMethod: "code",
  },
});

// sign up - our users will sign in using only phone and second factor code - to do this with cognito, everyone will have a static dummy password
const staticPass = "66febdf7-5b71-4c32-9272-b9d9dd703a60";
const phone = "+4219XXXXXXXX"; // replace with your phone number

const signUpResult = await Auth.signUp({
  username: phone,
  password: staticPass,
  // with this enabled, we'd get an active signed in session on Auth right after confirming sign up
  // autoSignIn: {
  //   enabled: true,
  // },
});

// run this section once you receive code via phone
const code = "XYZ";
await Auth.confirmSignUp(phone, code);

// log in once signed up
const loginResult = await Auth.signIn(phone, staticPass);
//receive code
await Auth.confirmSignIn(loginResult, code);
// done
console.log(Auth.currentUserInfo());
