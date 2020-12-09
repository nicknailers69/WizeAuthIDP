import * as PKCE from "pkce-challenge";
import * as NodeRSA from "node-rsa";
import * as Argon2 from "argon2";

export const Argon2Hash = async (str:string):Promise<any> => {

  return await Argon2.hash(Buffer.from(str));

}

export const VerifyArgon2 = async (str: string, hash: string): Promise<boolean> => {
  
  return await Argon2.verify(hash, str);

}