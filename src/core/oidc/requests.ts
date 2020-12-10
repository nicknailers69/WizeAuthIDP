import { Client } from '../../models/src/entity/Client';
import { User } from '../../models/src/entity/User';
import { Connection } from 'typeorm';
import { Authentication_Request } from '../../shared/interfaces/OpenIDConnect';
import * as JWT from 'jsonwebtoken';
import { JsonWebToken } from '../../shared/libs/JWT';
import { Keystore } from '../../shared/libs/Keystore';
import * as querystring from "querystring";

/*
scope: string;
    response_type: ResponseTypesEnum;
    client_id: string;
    redirect_uri: string;
    state: string;
    response_mode?: ResponseModesEnum;
    nonce?: string;
    display?: 'PAGE' | 'POPUP' | 'TOUCH' | 'WAP';
    prompt?: 'NONE' | 'LOGIN' | 'CONSENT' | 'SELECT_ACCOUNT';
    max_age?: string;
    ui_locales?: string[];
    id_token_hint?: string;
    login_hint?: string;
    acr_values?: string[];
*/

export type AuthenticationRequest = {

  scope: ["openid", "me"];
  prompt: "none";
  response_type: "code_token";
  client_id: number;
  redirect_uri: "/user/me";
  state: string; //csrf token
  display: "page";
  login_hint: "email" | "phone_number" | "nickname";
  id_token_hint?: string;
  max_age: 864000; //about 7 days

}


export class OptionRequest {

  protected _config: any;
  protected _options: any;
  protected _defaultRequestOptions: { headers: { Authorization: string, "Content-Type":any }, payload: any} = {headers:{Authorization:null, "Content-Type":null}, payload:null};

  constructor(config: any, credentials:string, params: any) {
    this._config = config;
    this._options = this.createOptions(config.authType, credentials, params);
  }

  createOptions(authType:"header"|"body"|"form", credentials:string, params:any) {

    const parameters = { ...params };
    const requestOptions = this._defaultRequestOptions;

    if (authType === "header") {
      requestOptions.headers.Authorization = `Bearer ${credentials}`;
    } 
    else if (authType === "body" || authType === "form") { 
      parameters["client_id"] = credentials.split(":")[0];
      parameters["secret"] = credentials.split(":")[1];
    }

    if (authType === "form") {
      requestOptions.payload = querystring.stringify(parameters);
      requestOptions.headers["Content-Type"] = 'application/x-www-form-urlencoded';
    }

    if (authType === "body") {
      requestOptions.payload = parameters;
      requestOptions.headers["Content-Type"] = 'application/json';
    }

    return requestOptions;
  }

  toObject(requestOptions = {}) {
    return JSON.parse(JSON.stringify(requestOptions));
  }

}


export class AuthenticateRequest {


  protected conn: Connection;
  protected _repo: any;
  protected _request: AuthenticationRequest = {
    scope: ["openid", "me"],
    prompt: "none",
    response_type: "code_token",
    client_id: null,
    redirect_uri: "/user/me",
    state: "",
    display: "page",
    login_hint: null,
    id_token_hint: null,
    max_age: 864000
  };
  protected _ks: Keystore;
  protected _config: any;

  
  _data:any

  constructor(config:any, params:any, conn:Connection, authData: any) {
    
    this._data = authData;
    this._config = config;
    if (this._data.email) this._request.login_hint = "email";
    else if (this._data.phone_number) this._request.login_hint = "phone_number";
    else if (this._data.nickname) this._request.login_hint = "nickname";
    this.conn = conn;
    this._ks = new Keystore();
    

  }

  async getUser():Promise<User | void> {

    const self = this;
    self._repo = this.conn.getRepository(User);
    try {
      if (this._request.login_hint === "email") {
        return await self._repo.findOne({ email: this._data.email });
      }
      if (this._request.login_hint === "nickname") {
        return await self._repo.findOne({ nickname: this._data.nickname });
      }
      if (this._request.login_hint === "phone_number") {
        return await self._repo.findOne({ phone_number: this._data.phone_number });
      }
    } catch (e) {
      return e;
    }

  }

  async getClientFromUser(userID: number): Promise<Client | void> {
    
    const self = this;
    self._repo = this.conn.getRepository(Client);
    try {
     
        return await self._repo.findOne({ User:userID });
    
    } catch (e) {
      return e;
    }

  }

  async BuildAuthenticationRequest(csrf:string, user: User, client: Client):Promise<any> {
    
    const JWK = new JsonWebToken();
    this._request.client_id = client.Identity;
    this._request.state = csrf;
  
    return new Promise((resolve, reject) => {
      JWK.signToken(JSON.stringify({ data: user.id, request: this._request })).then((st: any) => {
     
        this._request.id_token_hint = st;
        resolve(this._request);
    
    }).catch(e => console.log(e));
    })
 

  }





}
