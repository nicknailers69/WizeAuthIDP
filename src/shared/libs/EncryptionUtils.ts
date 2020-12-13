import PKCE, {verifyChallenge} from "pkce-challenge";
import * as NodeRSA from "node-rsa";
import * as Argon2 from "argon2";

export const Argon2Hash = async (str:string):Promise<any> => {

  return await Argon2.hash(Buffer.from(str));

}

export const VerifyArgon2 = async (str: string, hash: string): Promise<boolean> => {
  
  return await Argon2.verify(hash, str);

}

export const GetCodeChallenge = ():object => {
  const code = PKCE(42);
  return {c:code.code_challenge, v:code.code_verifier}
}

export const validateCodeChallenge = (code, verifier):boolean => {

  return verifyChallenge(verifier, code);

}