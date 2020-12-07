import {Context, DefaultContext} from "./Context";
import {Injectable} from "../shared/decorators/Injectable";
import {InjectProperty} from "../shared/decorators/InjectProperies";
import * as typeorm from "typeorm";
import * as events from "events";
import {DEFAULT_CLAIMS} from "../shared/interfaces/OpenIDConnect";
import {Keystore} from "../shared/libs/Keystore";
import {JWK} from "node-jose";
import * as Express from "express";
import {Models} from "../models/src";


export interface IWizeAuth {
    _ctx:Context;
}

@Injectable()
export class WizeAuth extends events.EventEmitter implements IWizeAuth  {



    _ctx:Context;
    ctx:DefaultContext;
    db:any
    issuer:string;
    config:any;
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

    constructor(app:Express.Application, issuer:string, config:any) {
        super();
        this.app = app;
        this.config = config;
        this.issuer = issuer;
        this._ctx = new Context();
        this._ctx.injectDatabaseInContext().then((ctx:DefaultContext) =>{
            this.ctx = ctx;
            this.db = ctx.db;



        const self = this;
        self.responseModes = new Map();
        self.grantTypeHandlers = new Map();
        self.grantTypeDupes = new Map();
        self.grantTypeParams = new Map([[undefined, new Set()]]);
        self.Claims = this.ctx.OIDContext.claims_supported;
        self.ClientModel = Models.client;
        self.Account = {findAccount: async () => {await this.db.manager.find(Models.user);}};
        self.OIDCContext = this.ctx.OIDContext;
        self.OIDCContext.issuer = this.issuer;
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

        self.OIDCContext.jwks_uri = "/.well-known/jwks.json";
        self.OIDCContext.authorization_endpoint = "/user/auth/authorize";
        self.OIDCContext.token_endpoint = "/user/auth/token";
        self.OIDCContext.userinfo_endpoint = "/user/info";

        this.app.use('/.well-known', (req, res) => {
            res.json(self.OIDCContext);
            res.end;
        });

            console.log(this.ctx);



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

}