import {Request, Response} from "express";
import {HandledConsentRequest} from "./consent/types";

export interface Strategy {
    HandleOAuth2AuthorizationRequest(req:Request, res:Response):HandledConsentRequest;
    HandleOpenIDConnectLogout(req:Request, res:Response):any;
}