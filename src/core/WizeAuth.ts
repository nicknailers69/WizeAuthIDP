import {Context, DefaultContext} from "./Context";
import {Injectable} from "../shared/decorators/Injectable";
import {InjectProperty} from "../shared/decorators/InjectProperies";
import * as typeorm from "typeorm";
import * as events from "events";
import {DEFAULT_CLAIMS} from "../shared/interfaces/OpenIDConnect";
import {Keystore} from "../shared/libs/Keystore";
import {JWK} from "node-jose";



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
            this.db = this.getDB();

        });

        const self = this;
        self.responseModes = new Map();
        self.grantTypeHandlers = new Map();
        self.grantTypeDupes = new Map();
        self.grantTypeParams = new Map([[undefined, new Set()]]);
        self.Account = {findAccount: () => {return this.config.parsed.test_users.admin}};
        self.Claims = DEFAULT_CLAIMS;
        const KeyStore = new Keystore();
        console.log("Loading KeyStore.....");
        KeyStore.loadKeys().then(ks => {
            this.KeyStore = ks;
            console.log(`${ks.all().length} Keys loaded as WizeAuth JWKS KeyStore`);
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