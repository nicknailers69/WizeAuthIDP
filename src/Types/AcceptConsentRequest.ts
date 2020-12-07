export type AcceptConsentRequest = {
    GrantAccessTokenAudience?:string[];
    GrantScope?:string[];
    HandledAt?:number;
    Remember?:boolean;
    RememberFor?:number;
    Session:any;
}