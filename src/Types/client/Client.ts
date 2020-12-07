import * as JOSE from "node-jose";

export type Client = {
    ID:string;
    OutfacingID:string;
    Name:string;
    Secret:string;
    RedirectURIS:string[];
    GrantTypes: string[];
    ResponseTypes: string[];
    Scope: string;
    Audience: string[];
    Owner:string;
    PolicyURI:string;
    AllowedCORSOrigins:string[];
    TermsOfServiceURI:string;
    ClientURI:string;
    LogoURI:string;
    Contacts:string[];
    SecretExpiresAt:string;
    SubjectType:string;
    SectorIdentifierURI?:string;
    JSONWebKeysURI?:string;
    JSONWebKeys?:JOSE.JWK.KeyStore;
    TokenEndpointAuthMethod?:string;
    TokenEndpointAuthAlgorithm?:string;
    RequestURIs?:string[];
    RequestObjectSigningAlgorithm?:string;
    UserInfoSignedResponseAlg?:string;
    CreatedAt:string;
    UpdatedAt?:string;
    FrontChannelLogoutURI?:string;
    FrontChannelLogoutSessionRequired?:boolean;
    PostLogoutRedirectURIs?:string[];
    BackChannelLogoutURI?:string;
    BackChannelLogoutSessionRequired?:boolean;
    Metadata:any;
    impl:IClient;
}

export interface IClient {
    GetID():string;
    GetRedirectURIs():string[];
    GetHashedSecret():Buffer;
    GetScopes():string[]| void;
    GetAudience():string[]| void;
    GetGrantTypes():string[]| ["authorization_code"];
    GetResponseTypes():string[]| ["code"];
    GetResponseModes():string[]| void;
    GetOwner():string | void;
    IsPublic():boolean;
    GetJSONWebKeysURI(): string;
    GetJSONWebKeys():JOSE.JWK.KeyStore;
    GetTokenEndPointAuthSigningAlgorithm():string | "RS256";
    GetRequestObjectSigningAlgorithm():string;
    GetTokenEndpointAuthMethod():string | "client_secret_basic";
    GetRequestURIs():string[]
}