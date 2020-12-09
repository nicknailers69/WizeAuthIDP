import {Context, DefaultContext} from "./Context";
import {Injectable} from "../shared/decorators/Injectable";
import {InjectProperty} from "../shared/decorators/InjectProperies";
import * as typeorm from "typeorm";
import * as events from "events";
import {DEFAULT_CLAIMS} from "../shared/interfaces/OpenIDConnect";
import {Keystore} from "../shared/libs/Keystore";
import {JWK} from "node-jose";
import * as Express from "express";
import { User } from '../models/src/entity/User';
import { VerifyArgon2 } from "../shared/libs/EncryptionUtils";



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

    constructor(conn:any, app:Express.Application, issuer:string, config:any) {
        super();
        this.app = app;
        this.config = config;
        this.issuer = issuer;
        this._ctx = new Context().create();
        

            this.db = conn;



        const self = this;
        self.responseModes = new Map();
        self.grantTypeHandlers = new Map();
        self.grantTypeDupes = new Map();
        self.grantTypeParams = new Map([[undefined, new Set()]]);
        self.Claims = this._ctx.OIDContext.claims_supported;
            self.ClientModel = "";
        self.Account = {findAccount: async (email:string) => {await this.db.getRepository(User).findOne({email:email});}};
        self.OIDCContext = this._ctx.OIDContext;
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

   

    afterLogin(req: Express.Request, res: Express.Response, next:Express.NextFunction) {
        res.redirect(req.params.redirect_uri || '/user/callback');
    }

    createUser(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
        
        this.db.getRepository(User).save(req.body).then(u => {
            next(u);
        }).catch(err => console.log(err));


    }

}