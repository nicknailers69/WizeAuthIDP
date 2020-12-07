export type OAuth2TokenIntrospection = {
    Active:boolean;
    Aud:string[];
    ClientID?:string;
    Exp?:number;
    Ext?:any;
    Iat?:number;
    Iss?:string;
    Nbf?:number;
    ObfuscatedSubject?:string;
    Scope?:string;
    Sub?:string;
    TokenType?:string;
    TokenUse?:string;
    Username?:string;
}