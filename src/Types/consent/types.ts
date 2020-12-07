import {ConsentRequestSession} from "../ConsentRequestSession";
import {ConsentRequest} from "../ConsentRequest";

export type RequestHandlerResponse = {
    RedirectTo:string;
}

export type LoginSession = {
    ID:string;
    AuthenticatedAt:string;
    Subject:string;
    Remember:boolean;
}


export type RequestDeniedError = {
    Name:string;
    Description:string;
    Hint:string;
    Code:string;
    Debug:string;
    Valid:boolean;
    impl:IRequestDeniedError;
}

export interface IRequestDeniedError {
    IsError():boolean;
    SetDefaults(name:string):void;
    toRFCError():RFC6749Error
    Scan(value:any):void;
    Value():any|void;
    get():RequestDeniedError;

}

export type RFC6749Error = {
    ErrorField:string;
    DescriptionField:string;
    HintField:string;
    CodeField:string;
    DebugField:string;
}

export type HandledConsentRequest = {
    ID:string; //or challenge (same)
    GrantedScope:string[];
    GrantedAudience:string[];
    Sessions:ConsentRequestSession; //not in db
    Remember:boolean;
    RememberFor:number;
    HandledAt:string;
    ConsentRequest:ConsentRequest;
    Error:RequestDeniedError;
    RequestedAt:string;
    AuthenticatedAt:string;
    WasUsed:boolean;
    SessionIDToken:Map<string, any>;
    SessionAccessToken:Map<string, any>;
}

export interface IHandledConsentRequest {
    HasError():boolean;
    BeforeSave(dbConn:any):Promise<any|HandledConsentRequest>;
    AfterSave(dbConn:any):Promise<any|HandledConsentRequest>;
    AfterFind(dbConn:any):Promise<any|HandledConsentRequest>;
}

export type PreviousConsentSessions = {
    ID:string;
    GrantedScope:string[];
    GrantedAudience:string[];
    Session:ConsentRequestSession;
    Remember:boolean;
    RememberFor:number;
    HandledAt:string;
    ConsentRequest:ConsentRequest;
    Error:RequestDeniedError;
    RequestedAt:string;
    AuthenticatedAt:string;
    WasUsed:boolean;
    SessionIDToken:Map<string, any>;
    SessionAccessToken:Map<string, any>;

}