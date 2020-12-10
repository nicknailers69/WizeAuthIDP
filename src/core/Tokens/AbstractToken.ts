import { AccessToken } from "src/models/src/entity/AccessToken";
import { Connection } from "typeorm";
import { Token } from "../../shared/interfaces/OpenIDConnect";
import { JsonWebToken } from "../../shared/libs/JWT";
import Express from "express";


export interface BaseToken {

  jit: string;
  iss: string;
  sub: string;
  aud: string;
  nonce: string;
  exp: number;
  iat: number;
  kty?: string;
  n?: string;
  e?: string;
  

}

export interface TokenWithClaims extends BaseToken {
  response_type: string;
  client_id: string;
  redirect_uri: string;
  scope: string | "openid";
  state: string;
  max_age: number;
  claims: Claims;
}

export interface IDToken {

 

}

export interface UserInfoClaim {
  gender?: string;
  birthdate?: string;
  contacts?: any;
  midde_name?: string;
  family_name: string;
  preferred_username?: string;
  given_name: string;
  nickname?: string | null;
  email: string;
  email_verified?: boolean;
  picture: string | null;
  profile: string;
  zoneinfo: string;
  locale: string;
  phone_number?: string;
  phone_number_verified?: boolean;
  address: object;
  updated_at: string;
}

export type Claims {
  userinfo: UserInfoClaim;
  id_token: IDToken;
}




export abstract class AbstractTokens implements BaseToken {
  jit: string;
  iss: string;
  sub: string;
  aud: string;
  nonce: string;
  exp: number;
  iat: number;
  kty?: string;
  n?: string;
  e?: string;

  responseType: string;
  conn: Connection;
  JWKLib: JsonWebToken;

  constructor() {
    this.JWKLib = new JsonWebToken();
  }
  
  protected create(token_type:string | null) {

    if (!token_type) {
      this.responseType = "code token";
    }

    switch (this.responseType) {
      case 'code token':
        break;
      case 'id_token':
        break;
      case 'id_token token':
        break;
      default:
        break;
    }

  }

  save(data: any): Promise<AccessToken> {
    return await this.conn.getRepository(AccessToken).save(data);
  }

  abstract impl(tokenType: string | null, tokenData: any, selfIssued: boolean, claims?: Claims);
  
  abstract mw(req: Express.Request, res: Express.Response, next: Express.NextFunction);

  async Encrypt(token:string):Promise<any> {
    return await this.JWKLib.encryptToken(token);
  }

  async Decrypt(token: string): Promise<any> {
    return await this.JWKLib.decryptToken(token);
  }

  async Sign(token: string): Promise<any> {
    return await this.JWKLib.signToken(token);
  }

  async VerifySignature(token: string): Promise<any> {
    return await this.JWKLib.verifySignature(token);
  }

  abstract verify(data: any): Promise<any>;

  abstract revoke(tokenType): any;
  
  abstract revokeAll(): any;

  getExpirationDate(expiresIn): Date {
    return new Date(Date.now() + Number.parseInt(expiresIn, 10) * 1000);
  }

  parseExpirationDate(expirationDate:any): Date {
    if (expirationDate instanceof Date) {
      return expirationDate;
    }

    if (typeof expirationDate === 'number') {
      return new Date(expirationDate * 1000);
    }

    return new Date(expirationDate);
  }


  
  

}