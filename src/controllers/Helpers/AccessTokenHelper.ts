import { AccessToken } from "../../models/src/entity/AccessToken";
import { Token } from "../../shared/interfaces/OpenIDConnect";
import { v4 } from "uuid";
import crypto from "crypto";

export class AccessTokenHelper implements Token {

  protected _repo:any;

 
  jti: string;
  token_class_name: string;
  format: string;
  exp: string;
  iat: string;
  accountId: string;
  clientId: string;
  aud: string[];
  authTime: number;
  claims: string[];
  rejected_claims: string[];
  extra_claims?: string[];
  codeChallenge: string;
  codeChallengeMethod: string;
  sessionUid: string;
  expiresWithSession?: boolean;
  grantId?: string;
  nonce?: string;
  redirectUri?: string;
  resource?: string;
  rotations?: number;
  initial_refresh_token_iat?: number;
  acr?: string;
  amr?: string[];
  scope?: string[];
  rejected_scopes?: string[];
  initial_sid_token_from?: string;
  'x5t#S256'?:string;
  jkt?: string;
  gty?: string;
  params?: object;
  user_device_code?: string;
  device_info?: object;
  device_in_flight?: boolean;
  device_error?: string;
  error_description?: string;
  policies?: string[];
  request?: string;


  constructor(conn:any) {
      
    this._repo = conn.getRepository(AccessToken);

  }

  
  setJti() {
    this.jti = v4().toString();
  }

  setTokenClassName() {
    this.token_class_name = "Bearer";
  }

  setFormat() {
    this.format = "jwks";
  }

  setNonce() {
    const random = crypto.randomBytes(64);
    this.nonce = crypto.createHash('sha256').update(Buffer.from(random)).digest('base64');
  }

  setScope(reqScopes:string[]) {

    this.scope = reqScopes;

  }

  setExp(exp: string) {
    this.exp = exp;
  }

  setIat(iat: string) {
    this.iat = iat;
  }

  setAud(aud: string) {
    this.aud = [aud];
  }

  setAuthTime(authtime: number) {
    this.authTime = authtime;
  }




  create(data:any) {

  }

}