import {OpenIDContext} from "./OpenIDContext";

export type LoginRequest = {
    Challenge:string;
    Client:any;
    OidcContext?:OpenIDContext;
    RequestURL?:string;
    RequestedAccessTokenAudience:string;
    RequestedScopes:string;
    SessionID?:string;
    Skip:boolean;
    Subject:string;
}