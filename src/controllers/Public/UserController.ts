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
import { Profile } from '../../models/src/entity/Profile';
import { ProfileMeta } from '../../models/src/entity/ProfileMeta';
import { Client } from '../../models/src/entity/Client';
import { VerifyArgon2 } from "../../shared/libs/EncryptionUtils";
import { getRepository, getConnection, createConnection } from "typeorm";
import * as UUID from "uuid";
import slugify from "slugify";
import { ClientHelper } from '../Helpers/Client';
import { AuthenticateRequest } from '../../core/oidc/requests';
import {JsonWebToken} from "../../shared/libs/JWT";
import {verifyChallenge} from "pkce-challenge";
import PKCE from "pkce-challenge";
import {v4} from "uuid";
import {nanoid} from "nanoid";
import path from "path";
import * as fs from "fs";

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
            "response_type":"id_token",
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
                    req.session.user = user;
                    req.csrf = req.csrfToken();
                    //we unset sensitive data

                    req.session.isLoggedIn = 1;
                    req.session.isAuthorized = 0;
                    res.redirect("/user/callback?state="+req.csrfToken());
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
    @Get('/signup')
    public loadSignupPage(req:any, res:Response) {
        res.cookie('XSRF-TOKEN', req.csrfToken(), {path:"/",  httpOnly:true, maxAge:3600, sameSite:"none" });
        this.challenge =  this.createChallenge();
        req.session.challenge = this.challenge;
        res.render('signup', {csrfToken:req.csrfToken(), challenge:this.challenge,  app_data:ExpressHttpContext.get('ctx').app});

    }

    // @ts-ignore
    @Post('/auth/create')
    public createUser(req:any, res:Response) {
        const userData = req.body;
        const profile = new Profile();
        profile.public_id = UUID.v4().toString();
        profile.slug = slugify(userData.name);
        const conn = ExpressHttpContext.get('conn');
        conn.getRepository(Profile).save(profile).then((p: Profile) => {
            const H = new UserHelper(conn);
            const C = new ClientHelper(conn);
           
            H.createNewUser(userData, p).then((nu: User) => {

                C.createClient({ name: nu.name, id:nu.id }).then((c: Client) => {
                    res.status(201).json({user:nu, client:c});
                    res.end();
                }).catch(err => console.log(err));

              
            }).catch(err => {
                res.status(500).json(err);
                res.end();
            })
            
        });


    }

    @Get('/callback')
    public callbackfunction(req: any, res: Response) {
        const conn = ExpressHttpContext.get('conn');
     
        conn.getRepository(Client).findOne({ User: req.session.user.id }).then((c: Client) => {
            const a = new AuthenticateRequest({}, {client_id:c.Identity, secret:c.Secret}, conn, {});
            a.BuildAuthenticationRequest(req.query.state, req.session.user, c).then((b:any) => {
                let redirect = b.redirect_uri;
               conn.getRepository(User).find(c.User).then((u) => {
                   const token = new JsonWebToken('id_token', u);
                   token.createNewToken().then(tok => {
                       console.log(tok);
                       res.redirect(redirect+"?id_token="+tok);
                   });


               })


            });
        })
       
    }

    @Get('/me')
    public getMe(req: any, res: Response) {
        if (!req.session.user || !req.session.isLoggedIn) {
            res.redirect("/user/login");
        } else { 
            const conn = ExpressHttpContext.get('conn');
            conn.getRepository(User).find({ id: req.session.user.id, relations: ["profile"] }).then((data: any) => {

                if(req.query.id_token) {
                    const token = new JsonWebToken('id_token', {});
                    token.verifySignature(req.query.id_token).then((v) => {
                        console.log(v.code);
                        if(v.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' && res.getHeader('x-id-token-verified') === 0) {
                            req.session.destroy();
                            res.setHeader('x-id-token-verified', 0);
                            res.setHeader('x-wyzer-user-id', null);
                            res.setHeader('x-wyzer-authorized', null);
                            res.setHeader('x-wyzer-profile-id', null);
                            res.setHeader('x-wyzer-scopes', null);
                            res.redirect("/user/login");
                        }
                        const resData = data;
                        delete resData[0].password;

                        const expires = new Date("+1 day");
                        res.setHeader('x-id-token-verified', 1);
                        res.setHeader('x-wyzer-user-id', `${data[0].id}`);
                        res.setHeader('x-wyzer-authorized', 1);
                        res.setHeader('x-wyzer-scopes', 'own_profile:all');
                        res.cookie('x-wyzer-profile-id', data[0].profile.public_id, {sameSite:"none",secure:true,httpOnly:true,domain:".wyzer.wizegene.com", expires:expires});
                        res.cookie('x-wyzer-provider-sso', 1, {sameSite:"none",secure:true,httpOnly:true,domain:".wyzer.wizegene.com", expires:expires});
                        res.cookie('x-wyzer-provider-id', v.aud,  {sameSite:"none",secure:true,httpOnly:true,domain:".wyzer.wizegene.com", expires:expires})
                        const redirectTo = v.aud.replace("urn:","https://").replace(":audience","/");
                        const code = PKCE(43);
                        const verifier = code.code_verifier;
                        req.session.verifier = verifier;
                        req.session.remote = redirectTo;

                        res.redirect(redirectTo+"?provider=wyzer&code="+code.code_challenge);

                    }).catch(e => {
                        res.redirect("/user/login");
                    });
                }

            });
        }
    }

    @Post('/remote/code')
    public verifyCodeRemote(req:any, res:Response) {

        const verifier = req.session.verifier;
        if(!verifier) {
            res.status(502).send('invalid request');
            return;
        }

        const code = req.body.code;
        if(!code) {
            res.status(502).send('invalid request');
            return;
        }

        if(!!(verifyChallenge(verifier, code))) {


            res.cookie('x-wyzer-prompt','consent');
            const consentID = v4().toString();
            res.cookie('x-wyzer-consent-id', consentID);
            res.sendStatus(201);
            return;
        }

        res.status(502).send('invalid request');
        return;


    }

    @Get('/remote/popup/consent')
    public showRemoteConsent(req:any, res:any) {

            const consentID = req.query.consent_id;
            const user = req.query.user_id;
            const requester = req.query.requester;
            const showConsent = req.query.show;

            const consentHtml = "<style>* {font-family:Helvetica, Arial, sans-serif;}</style><script src='https://cdn.jsdelivr.net/npm/sweetalert2@10'></script><script type='application/javascript'>" +
                "" +
                "function approveConsent() { return true; } function denyConsent() {return false}</script><div id='wyzer-consent-popup'><form id='consent__"+consentID+"'>" +
                "<input type='hidden' name='consent_id' value='"+consentID+"'/>" +
                "<input type='hidden' name='user_id' value='"+user+"' />" +
                "<input type='hidden' name='requester' value='"+requester+"'/>" +
                "<input type='hidden' name='session_id' value='"+req.session.id+"'/>" +
                "<input type='hidden' id='show_consent' data-show='"+showConsent+"'/>" +
                "</div></form><script>" +
                "Swal.fire({" +
                "title:'Do you want to approve "+requester.toUpperCase()+" to use Wyzer to access your full profile?'," +
                "showDenyButton:true," +
                "showCancelButton:true," +
                "confirmButtonText:'I APPROVE'})</script>";

            res.setHeader('Content-Type', 'text/html; charset=UTF-8');
            res.status(200).send(consentHtml);
            return;


    }

    @Get('/remote/popup/login')
    public showRemoteLogin(req:any, res:any) {

        const requestID = nanoid(20).toString();
        const requesterID = req.query.requester;
        const showLogin = req.query.show;

        const consentHtml = "<style>* {font-family:Helvetica, Arial, sans-serif;}</style><script src='https://cdn.jsdelivr.net/npm/sweetalert2@10'></script><script type='application/javascript'>" +
            "" +
            "function approveConsent() { return true; } function denyConsent() {return false}</script><div id='wyzer-consent-popup'><form id='consent__"+requestID+"'>" +
            "<input type='hidden' name='request_id' value='"+requestID+"'/>" +
            "<input type='hidden' name='action_type' value='LOGIN' />" +
            "<input type='hidden' name='requester' value='"+requesterID+"'/>" +
            "<input type='hidden' name='session_id' value='"+req.session.id+"'/>" +
            "<input type='hidden' id='show_login' data-show='"+showLogin+"'/>" +
            "</div></form><script>" +
            "Swal.fire({" +
            "title:'Login to "+requesterID.toUpperCase()+"'," +
            "html:`<input type='text' id='login' class='swal2-input' placeholder='Email'>" +
            "<input type='hidden' name='request_id' value='"+requestID+"'/>" +
            "<input type='hidden' name='action_type' value='LOGIN' />" +
            "<input type='hidden' name='requester' value='"+requesterID+"'/>" +
            "<input type='hidden' name='session_id' value='"+req.session.id+"'/>" +
            "<input type='hidden' id='show_login' data-show='"+showLogin+"'/>" +
            "  <input type='password' id='password' class='swal2-input' placeholder='Password'>`,"+
            "confirmButtonText:'SIGN IN'," +
            "focusConfirm:false," +
            "})</script>";

        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        res.status(200).send(consentHtml);
        return;

    }

    @Post('/remote/popup/login/geturl')
    getLoginURL(req:any, res:any) {
const base64url = require('base64-url');
        //need appid
        const APPID = req.body.application_id;
        const requester_url = req.body.requester_url;
        const redirect_uri = req.body.redirect_uri;
        const ENCRYPTED_SECRET = req.body.secret;

        const loginURL = `https://wyzer.wizegene.com/user/remote/login/`;
        const params = `?a=${APPID}&ru=${requester_url}&reUri=${redirect_uri}`;
        const nodersa = require('node-rsa');
        const N = new nodersa();
        const serverKeys = fs.readFileSync(path.resolve(__dirname,'../../../.server_keys')).toString();
        const keys = N.importKey(serverKeys, 'private');
        const enc = keys.encryptPrivate(params);

        res.status(201).send(`${loginURL}?u=${enc}`);
        return;

    }

    @Get('/remote/popup/login/geturl')
    redirectPostLoginURL(req:any, res:any) {
        //need appid
        const APPID = req.body.application_id;
        const requester_url = req.body.requester_url;
        const redirect_uri = req.body.redirect_uri;
        const ENCRYPTED_SECRET = req.body.secret;
        console.log(req.ip);
        const base64url = require('base64-url');

        const loginURL = `https://wyzer.wizegene.com/user/remote/popup/login/`;
        const params = `?a=${APPID}&ru=${requester_url}&ri=${redirect_uri}&s=1`;
        const nodersa = require('node-rsa');
        const N = new nodersa();
        const serverKeys = fs.readFileSync(path.resolve(__dirname,'../../../.server_keys')).toString();
        const keys = N.importKey(serverKeys, 'private');
        const enc = base64url.encode(keys.encryptPrivate(params));

        res.status(201).send(`${loginURL}?u=${enc}`);
        return;

    }


    checkIf_APPID_IP_REFERRER_IsAllowedMiddleware(req:any, res:any, next:any) {
        const ip = req.ip;
        const referrer = req.referrer;
        const appid = req.body.application_id;

    }


}