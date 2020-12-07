import {Controller} from "../../shared/decorators/ControllerClassDecorator";
import {Get, Put, Post, Delete} from "../../shared/decorators/RoutesDecorator";
import {Request, Response} from "express";

@Controller('/auth')
export default class AuthController {

    @Get('/login')
    public getLoginRequest(req:Request, res:Response) {

        const Challenge = `${req.params.challenge}:${req.params.login_challenge}`;
        if(!Challenge || Challenge === "") {
            res.status(501).send(new Error('invalid request, challenge was not set.'));
            return;
        }

        //@todo send login request to consent manager pseudo code: ConsentManager.GetLoginRequest(req.Context, Challenge)


        //@todo return client request (sanitized)
        return res.status(200).send({'message':'loginpage'});
    }

    @Put('/login/accept')
    public acceptLoginRequest(req:Request, res:Response) {
        const Challenge = `${req.params.challenge}:${req.params.login_challenge}`;
        if(!Challenge || Challenge === "") {
            res.status(501).send(new Error('invalid request, challenge was not set.'));
            return;
        }
    }

    @Put('/login/reject')
    public rejectLoginRequest(req:Request, res:Response) {

    }

    @Get('/consent')
    public consentRequest(req:Request, res:Response) {

    }

    @Put('/consent/accept')
    public acceptConsentRequest(req:Request, res:Response) {

    }

    @Put('/consent/reject')
    public rejectConsentRequest(req:Request, res:Response) {

    }

    @Delete('/session')
    public deleteLoginSession(req:Request, res:Response) {

    }


    /**
     *  @Description Get Consent Requests Sessions (OAuth2)
     *  @Get /auth/sessions/consent
     *  @Use user.Context(), subject, limit?, offset?
     *  @Returns array of consents requests
     *
     **/

    @Get('/sessions/consent')
    public getConsentSessions(req:Request, res:Response) {
        if(req.params.subject === "") {
            res.status(501).send(new Error('invalid request subject is not defined'));
            return;
        }

        const subject:string = req.params.subject;
        const limit:number = parseInt(req.params.limit) || 1;
        const offset:number = parseInt(req.params.offset) || 0;
        const ConsentSessionsQueue:any[] = [];

        //@todo find subject granted consent requests and push in @const ContentSessionsQueue[]


        const ConsentSessions = [];

        ConsentSessionsQueue.forEach(session => {
            session.ConsentRequest.Client = ""; //@todo sanitize consent request
            ConsentSessions.push(session);
        });

        res.status(204).json(ConsentSessions);
        return;
    }

    @Delete('/sessions/consent')
    public deleteConsentSessions(req:Request, res:Response) {
        const subject = req.params.subject;
        const client = req.params.client;
        const allClients = req.params.all || true;

        if(subject === "") {
            res.status(501).send(new Error('invalid request subject is not defined'));
            return;
        }

        if(client.length > 0) {
            //@todo revoke subject client session
        }

        else if(allClients) {
            //@todo revoke all
        }

        else {
            res.status(501).send(new Error('invalid request client and all must be defined.'));
        }



    }

    @Get('/logout')
    public getLogoutRequest(req:Request, res:Response) {

    }

    @Put('/logout/accept')
    public acceptLogoutRequest(req:Request, res:Response) {

    }

    @Put('/logout/reject')
    public rejectLogoutRequest(req:Request, res:Response) {

    }

    @Post('/signup')
    public postSignupRequest(req:Request, res:Response) {

    }





}