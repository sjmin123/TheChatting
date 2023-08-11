import jwt from "jsonwebtoken";
import validator from "validator";
import { ApolloError } from "apollo-server";


const tokenValidation = (token) => {
  try {
    console.log("tokenValidation 시작!");
    if (!token) {
      console.log("no token");
      throw new ApolloError('You are not authenticated!');
    }
    // token validation 해주기.
    if (!validator.isJWT(token)) {
      console.log("token 인증 실패!");
      throw new ApolloError('Token error!');
    };
    console.log("tokenValidation 성공!");
    return jwt.decode(token).token;
  } catch (error) {
    throw {
      code: 'TOKEN_ERROR',
      message: 'Token validation failed.',
    }
  }
};
export default tokenValidation;