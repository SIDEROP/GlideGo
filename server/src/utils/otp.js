import speakeasy from "speakeasy";

export const generateOTP = () => {
  const secret = speakeasy.generateSecret({ length: 20 }); 
  const otp = speakeasy.totp({
    secret: secret.base32,
    encoding: "base32",
    step: 86400, 
  });

  return { otp, secret: secret.base32 }; 
};


export const verifyOTP = (enteredOTP, secret) => {
  const isVerified = speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token: enteredOTP,
    window: 1,
    step: 86400, 
  });

  return isVerified;
};
