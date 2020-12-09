import {Controller} from "../../shared/decorators/ControllerClassDecorator";
import {Get, Post} from "../../shared/decorators/RoutesDecorator";
import { Request, Response, NextFunction } from 'express';
import {DEFAULT_SCOPES} from "../../shared/interfaces/OpenIDConnect";
import * as crypto from "crypto";
import {UserLoginRequest, querySchema} from "../../shared/querySchema/UserLoginRequest";
import {createValidator, ValidatedRequest} from "express-joi-validation";
const ExpressHttpContext = require("express-http-context");
import { UserHelper } from "../Helpers/UserHelper";
import { User } from '../../models/src/entity/User';
import { VerifyArgon2 } from "../../shared/libs/EncryptionUtils";
import { getRepository, getConnection, createConnection } from "typeorm";

const validator = createValidator();

@Controller('/user')
export default class UserController {

    // @ts-ignore
    @Get('/')
    public index(req:Request, res:Response) {
        return res.status(200).send({'message':'welcome to wizeauth api ::: user endpoint'});
    }

    challenge:string;
    // @ts-ignore
    @Get('/login')
    public userLogin(req:any, res:Response) {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        this.challenge =  this.createChallenge();
        req.session.challenge = this.challenge;

        res.render('login', {csrfToken:req.csrfToken(), challenge:this.challenge, app_data:ExpressHttpContext.get('ctx').app});
    }

    createChallenge():string {
        const challengeBytes = crypto.randomBytes(26);
        const hash:any = crypto.createHash('sha256').update(challengeBytes.toString('hex'));
        return hash.digest("hex");
    }

    @Post('/login', validator.body(querySchema))
    public  dologin(req:any, res:Response) {
        const email = req.sanitize(req.body._email);
        const password = req.sanitize(req.body._password);
        const code = crypto.randomBytes(16).toString("base64");
        const nonce = crypto.randomBytes(8).toString("base64");
        req.session.nonce = nonce;
        res.status(201).send({
            "scope":DEFAULT_SCOPES.split(","),
            "response_type":"code",
            "code":code,
            "nonce":nonce,
            "id_token":"",
            "redirect_uri":"/authenticate"
        });
        }
        

    // @ts-ignore
    @Post('/auth/authorize', validator.body(querySchema))
    public verifyLogin(req: any,res:Response) {



        if(req.body._email === "" || req.body._password === "" || req.body._challenge === "" || typeof req.body._email !== 'string' ||
        typeof req.body._password !== 'string') {
            res.status(401).send("unauthorized request is invalid.");
            return;
        }

        if(!req.session.id) {
            res.status(401).send("unauthorized request is invalid session id missing or xsrf token.");
            return;
        }

        if(!(req.session.id === req.sanitize(req.body._session_id))) {
            res.status(401).send("unauthorized request is invalid session id.");
            return;
        }

        if(!(req.sanitize(req.body._challenge) === req.session.challenge)) {
            res.status(401).send("unauthorized request is invalid bad challenge.");
            return;
        }

        const email = req.sanitize(req.body._email);
        const password = req.sanitize(req.body._password);
        const code = crypto.randomBytes(16).toString("base64");
        const nonce = crypto.randomBytes(8).toString("base64");
        req.session.nonce = nonce;
        res.status(201).send({
            "scope":DEFAULT_SCOPES.split(","),
            "response_type":"code",
            "code":code,
            "nonce":nonce,
            "id_token":"",
            "redirect_uri":"/auth/authenticate"
        });


    }

    // @ts-ignore
    @Post('/auth/authenticate')
    public doLogin(req:any, res:Response) {

        const conn = ExpressHttpContext.get('conn');
        
        conn.getRepository(User).findOne({ email: req.body._email }).then((user: User) => {
            
            if (user) {
                this.validateUser(req.body._password, user).then((v: any) => {
                    req.session.user = v;
                    res.redirect("/user/callback");
                }).catch(err => {
                    console.log(err);
                    res.status(401).send("invalid credentials.");
                })
            } else {
                
                res.status(404).send("user does not exists.");
            }

        }).catch(err => {
            console.error(JSON.stringify(err));
            res.status(500).json(err);
            res.end();
        });



    }

    public validateUser(password:string, acct:User) {

        return new Promise((resolve, reject) => {
            const hash = acct.password;
            VerifyArgon2(password, hash).then((valid: boolean) => {
                if (!valid) {
                    reject(new Error("invalid credentials."));
                }
                resolve(acct);

            }).catch(err => {
                console.log(err);
                reject(err);
            });

        });
            


    }

    // @ts-ignore
    @Post('/signup')
    public loadSignupPage(req:any, res:Response) {
        res.cookie('XSRF-TOKEN', req.csrfToken(), {path:"/",  httpOnly:true, maxAge:3600, sameSite:"none" });
        this.challenge =  this.createChallenge();
        req.session.challenge = this.challenge;
        res.render('signup', {csrfToken:req.csrfToken(), challenge:this.challenge});

    }

    // @ts-ignore
    @Post('/auth/create')
    public createUser(req:any, res:Response) {

        const userData = req.body;
        const conn = ExpressHttpContext.get('conn');
        const H = new UserHelper(conn);
        H.createNewUser(userData).then((nu: User) => {
            res.status(201).json(nu);
            res.end();
        }).catch(err => {
            res.status(500).json(err);
            res.end();
        })
        


    }

    @Get('/callback')
    public callbackfunction(req: any, res: Response) {
        res.json(req);
        res.end();
    }

}