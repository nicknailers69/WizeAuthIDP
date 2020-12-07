export type OAuth2TokenResponse = {
    AccessToken?:string;
    ExpiresIn?:number;
    IDToken?:string;
    RefreshToken?:string;
    Scope?:string;
    TokenType?:string;
}