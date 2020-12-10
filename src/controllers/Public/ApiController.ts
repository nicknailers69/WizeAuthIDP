import {Controller} from "../../shared/decorators/ControllerClassDecorator";
import {Delete, Get, Post, Put} from "../../shared/decorators/RoutesDecorator";
import {Request, Response} from "express";
import {Injectable} from "../../shared/decorators/Injectable";
import csurf from "csurf";
const ExpressHttpContext = require("express-http-context");
import { Client } from "../../models/src/entity/Client";
import { Auth } from "../../models/src/entity/Auth";

import { AccessToken } from "../../models/src/entity/AccessToken";
import * as PKCE from "pkce-challenge";

@Controller('/api/v1')
@Injectable()
export default class ApiController {

    // @ts-ignore
    @Get('/')
    public index(req:Request, res:Response) {
        return res.status(200).send({'message':'welcome to wizeauth api'});
    }

    @Post('/authenticate')
    public apiAuthenticate(req: any, res: Response) {
        const client = req.body.client;
        const secret = req.body.secret;
        const conn = ExpressHttpContext.get('conn');
        conn.getRepository(Client).findOne({ key: client }).then((client: Client) => {
           
            if (client) {
                
                

            } else {
                req.session.unauthorized = 1;
                res.redirect('/api/v1/reject');
            }
            

        });
        const challenge = PKCE.default(64);
        req.session.code.challenge = challenge.code_challenge;
        req.session.code.verifier = challenge.code_verifier;
        res.redirect(201, '/api/v1/verifyChallenge?code=' + challenge.code_challenge);


    }


    @Post('/verifyChallenge')
    public verifyChallenge(req, res) {
        
        if (!req.params.code || !req.session.code.verifier) {
            res.redirect('/api/v1/reject');
        }

        if (!(req.params.code === req.session.code.challenge)) {
            res.redirect('/api/v1/reject');
        }

        if (!PKCE.verifyChallenge(req.session.code.verifier, req.params.challenge)) {
            res.redirect('/api/v1/reject');
        }

        res.redirect(201, '/api/v1/token');


        }


    @Get('/reject')
    public rejectRequest(req: Request, res: Response) {
        res.status(400).send({ message: "unauthorized api usage detected." });
    }
    

    @Get('/accept')
    public acceptRequest(req: Request, res: Response) {
        
    }

    @Put('/client')
    public createClient(req: Request, res: Response) {
        
    }

    @Get('/resources/:name')
    public getResourceReadScope(req: Request, res: Response) {
        
    }

    @Put('/resources/:name')
    public getResourceWriteScope(req: Request, res: Response) {
        
    }
    
    @Post('/resources/:name')
    public getResourceUpdateScope(req: Request, res: Response) {
        
    }
    
    @Delete('/resources/:name')
    public getResourceDeleteScope(req: Request, res: Response) {
        
    }

    @Post('/resources/:name/:scope/authorize')
    public AuthorizeResourceAccess(req: Request, res: Response) {
        
    }

    @Get('/token')
    public setToken(req: any, res: Response) {
        
    }

}