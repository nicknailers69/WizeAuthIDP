import Config from "./shared/libs/ConfigParser";
import Router from "./routes";

import {WizeAuth} from "./core/WizeAuth";
import Express from "express";
import {Injectable} from "./shared/decorators/Injectable";
import {InjectProperty} from "./shared/decorators/InjectProperies";
import CookieParser from "cookie-parser";
import * as Redis from "redis";
import Session from "express-session";

import ExpressHttpContext from "express-http-context";
import ExpressHandlebars from "express-handlebars";
import CSURF from "csurf";
const redisStore = require('connect-redis')(Session);
const redisClient = Redis.createClient();
import expressSanitizer from 'express-sanitizer';
import requestIp from 'request-ip';
const app = Express();

@Injectable()
export class Application extends WizeAuth {


    readonly app:Express.Application;
    @InjectProperty("Config")
    readonly config:typeof Config;
    private _server_keys:any;
    private _jwks:any;
    private _registry:any;

    constructor() {
        super(app, "wizeauth", Config);

        this.app.disable('x-powered-by');
        this.app.set('trust proxy', true);
        this.app.use(requestIp.mw())
        this.app.use(Express.json());
        this.app.use(Express.urlencoded({extended:false}));
        this.app.use(expressSanitizer());
        this.app.use(CookieParser("5DB999F72672EC35208836967E4E800D1EAE7553A245FB3E332263B3CBCF58B1"));
        this.app.use(Session(
            {
                store: new redisStore({client:redisClient}),
                secret:"5DB999F72672EC35208836967E4E800D1EAE7553A245FB3E332263B3CBCF58B1",
                resave:false,
                saveUninitialized:true
            }
        ));
        this.app.use(function (req, res, next) {
            if (!req.session) {
                return next(new Error('session is not set!')) // handle error
            }
            res.locals.session = req.session;
            next() // otherwise continue
        })
        this.app.use(CSURF({cookie:true}));
        this.app.use(ExpressHttpContext.middleware);



        this.app.use( (req:any, res, next) => {
            this.setExpressContext();
            let   ctx = ExpressHttpContext.get('ctx');


            ctx.current_ip = req.clientIp;
            ExpressHttpContext.set('ctx', ctx);
         console.log((ExpressHttpContext.get('ctx')));
           next();
        });
        this.app.use("/assets", Express.static('public'));
        this.app.engine('hbs', ExpressHandlebars({
            defaultLayout: 'main',
            extname: '.hbs'
        }));
        this.app.set('view engine', 'hbs');


        this.initEndpoints();


    }



   getContextValue(key:string, section?:string):any | undefined {

        if(!this.ctx[key]) {
            if(!(typeof section === undefined)) {
                return this.ctx[section][key] || undefined;
            } else {
                return undefined;
            }
        }
        return this.ctx[key] || undefined;
    }

    setExpressContext() {
        ExpressHttpContext.set("config", this.config);
        ExpressHttpContext.set("ctx", {
            app: {
                name:"wizeauth",
                version:"1.0.0",
                logo_url:"/assets/logo.png",
                favicon_url:"/assets/favicon.png"
            },
            active_user:{},
            previous_request:{},
            current_request:{},
            last_used_token:"",
            last_seen:new Date().getTime(),
            refresh_token_exp_in_sec:0,
            refresh_token_iat:0,
            current_ip: "",
            enc_user_keys:"",
            ext_auth_provider: {
                name:"",
                id: "",
                scope:["email", "picture", "display_name", "offline"],
                response_data:{}
            },
            vault_id: ""

        })
    }

    private getConfigData(section:string, key:string) {
        return this.getContextValue(key, section);
    }

    getServerKeys() {
        return this._server_keys;
    }

    initJWKS() {

    }

    initServerKeys() {

    }

    initSecretsEngine() {

    }

    initEndpoints() {
        Router(this.app);
    }

    getApp() {
        return this.app;
    }

}