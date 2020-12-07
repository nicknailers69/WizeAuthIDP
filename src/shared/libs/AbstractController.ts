import {Request, Response, NextFunction, Application} from "express";
import {OpenIDContext} from "../../Types/OpenIDContext";
import * as UUID from "uuid";

export type Controller = {
    readonly ID:string;
    readonly Type:string;
    readonly Protected?:boolean;
    readonly Context?:OpenIDContext;
    readonly Policies?:any;
}

export interface IController {
    ControllerImpl(req:Request,res:Response,next?:NextFunction);
    execute():Promise<void>;
}

export abstract class AbstractController implements IController {

    readonly ID: string;
    readonly Type: string;
    private readonly Context:OpenIDContext;
    private readonly Protected:boolean;
    private readonly Policies:any;
    private readonly _request:Request;
    private readonly _response:Response;
    private readonly _next:NextFunction;

    private constructor(req:Request,res:Response,cType:string="default",next?:NextFunction,ctx?:OpenIDContext,is_protected?:boolean, policies?:any) {

        this.ID = UUID.v4().toString();
        this.Type = cType;
        if(ctx) this.Context = ctx;
        if(is_protected) this.Protected = is_protected;
        if(policies) this.Policies = policies;
        this._request = req;
        this._response = res;
        if(next) this._next = next;

    }



    abstract ControllerImpl(req:Request,res:Response,next?:NextFunction);

    execute():Promise<void> {
        return this.ControllerImpl(this._request,this._response,this._next);
    }


}