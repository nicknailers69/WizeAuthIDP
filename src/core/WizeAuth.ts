import {Context, DefaultContext} from "./Context";
import {Injectable} from "../shared/decorators/Injectable";
import {InjectProperty} from "../shared/decorators/InjectProperies";
import * as typeorm from "typeorm";
import * as events from "events";
import { DEFAULT_CLAIMS, DEFAULT_SCOPES } from '../shared/interfaces/OpenIDConnect';
import {Keystore} from "../shared/libs/Keystore";
import {JWK} from "node-jose";
import * as Express from "express";
import { User } from '../models/src/entity/User';
import { Provider } from './Provider';
import { Json } from "../shared/interfaces/JsonArray";
import { Client } from "../models/src/entity/Client";
import { AccessToken } from "../models/src/entity/AccessToken";
import { Auth } from "../models/src/entity/Auth";


export interface IWizeAuth {
    _ctx:Context;
}

@Injectable()
export class WizeAuth extends events.EventEmitter implements IWizeAuth  {



    _ctx:Context;
    ctx:DefaultContext;
    db: any;
    repo: any;
    issuer:string;
    config: any;
    providerConfig: Provider;
    app:Express.Application;
    responseModes:Map<any,any>;
    grantTypeHandlers:Map<any,any>;
    grantTypeDupes:any;
    grantTypeParams:Map<any,any>;
    Account:any;
    Claims:any;
    BaseModel:any;
    BaseTokenModel:any;
    IdTokenModel:any;
    ClientModel:any;
    InteractionModel:any;
    AccessTokenModel:any;
    AuthorizationCodeModel:any;
    RefreshTokenModel:any;
    ClientCredentialsModel:any;
    InitialAccessTokenModel:any;
    RegistrationAccessTokenModel:any;
    ReplayDetectionModel:any;
    DeviceCode:any;
    PushedAuthorizationRequest:any;
    OIDCContext:any;
    KeyStore:JWK.KeyStore;

    constructor(conn: any, app: Express.Application, issuer: string, config: any) {
        super();
        this.app = app;
        this.config = config;
        this.issuer = issuer;
        this.providerConfig = this.createProvider(issuer,   "/user/auth/authorize", '/user/info', '/.well-known/jwks.json', DEFAULT_SCOPES.split(","), ["id_token", "code_token","code_id_token"], ["pairwise"], ["RS256"], DEFAULT_CLAIMS);
        this._ctx = new Context().create();
        

        this.db = conn;



        const self = this;
        self.responseModes = new Map();
        self.grantTypeHandlers = new Map();
        self.grantTypeDupes = new Map();
        self.grantTypeParams = new Map([[undefined, new Set()]]);
        self.Claims = this.providerConfig.claims_supported;
        self.ClientModel = "";
        self.Account = { findAccount: async (email: string) => { await this.db.getRepository(User).findOne({ email: email }); } };
        self.ClientModel = { findClient: async (client_id) => { await this.db.getRepository(Client).findOne({ key: client_id }) } };
        self.AccessTokenModel = { findToken: async (token) => { await this.db.getRepository(AccessToken).findOne({ Token: token }) } };
        self.AuthorizationCodeModel = {findByCode: async (code) => {await this.db.getRepository(Auth).findOne({code:code})}}
        self.OIDCContext = this._ctx.OIDContext;
        const KeyStore = new Keystore();
        console.log("Loading KeyStore.....");
        KeyStore.loadKeys().then(ks => {
            this.KeyStore = ks;
            console.log(`${ks.all().length} Keys loaded as WizeAuth JWKS KeyStore`);
            console.info("you can view them at http://localhost:3333/.well-known/jwks.json");
        });

        this.app.use('/.well-known/jwks.json', (req, res) => {
            res.json(this.KeyStore.toJSON());
            res.end;
        });

        self.OIDCContext = this.providerConfig;
        this.app.use('/.well-known', (req, res) => {
            console.log(self.OIDCContext)
            res.json({ oidc: self.OIDCContext });
            res.end;
        });

      


    }

    addCtx(key:string, value:string) {
        this.ctx[key] = value;
    }

    getDB() {
        return this.ctx.db;
    }

    set _reponseModes(value:any) {
        this.responseModes = value;

    }

    createProvider(issuer: string,
        authorization_endpoint: string,
        userinfo_endpoint: string,
        jwks_uri: string,
        scopes_supported: string[],
        response_types_supported: Json,
        subject_types_supported: Json,
        id_token_signing_alg_values_supported: Json,
        claims_supported: Json) {
        
        const provider = new Provider(issuer, authorization_endpoint, userinfo_endpoint, jwks_uri, scopes_supported, response_types_supported, subject_types_supported,
            id_token_signing_alg_values_supported, claims_supported);
        
        return provider;

    }

   

    afterLogin(req: Express.Request, res: Express.Response, next:Express.NextFunction) {
        res.redirect(req.params.redirect_uri || '/user/callback');
    }

    createUser(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
        
        this.db.getRepository(User).save(req.body).then(u => {
            next(u);
        }).catch(err => console.log(err));


    }

    getAuthorizationHeaderToken(clientID: string, clientSecret: string) {
        return `${clientID}:${clientSecret}`;
    }

}