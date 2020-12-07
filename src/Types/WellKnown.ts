export type WellKnown = {
    AuthorizationEndpoint:string;
    BackchannelLogoutSupported?:boolean;
    BackchannelLogoutSessionSupported?:boolean;
    ClaimsSupported:boolean;
    ClaimsParametersSupported?:string[];
    EndSessionEndpoint?:string;
    FrontchannelLogoutSupported?:boolean;
    FrontchannelLogoutSessionSupported?:boolean;
    GrantTypesSupported:string[];
    IDTokenSigningAlgValuesSupported:string[];
    Issuer:string;
    JwksUri:string;
    RegistrationEndpoint?:string;
    RequestSiningAlgValuesSupported:string[];
    RequestParametersSupported?:boolean;
    RequestURIParametersSupported?:boolean;
    RequireRequestURIRegistration?:boolean;
    ResponseModesSupported:string[];
    ResponseTypesSupported:string[];
    ScopesSupported:string[];
    SubjectTypesSupported:string[];
    TokenEndpoint:string;
    TokenEndpointAuthMethodsSupported:string[];
    UserInfoEndpoint?:string;
    UserEndpointSingingAlgValuesSupported:string[];
}

export interface IWellKnown {
    Validate(formats:any):boolean|void;
    ValidateAuthorizationEndpoint(formats:any):boolean|void;
    ValidateIDTokenSiningAlgValuesSupported(formats:any):boolean|void;
    ValidateIssuer(formats:any):boolean|void;
    ValidateJWKSUri(formats:any):boolean|void;
    ValidateResponseTypeSupported(formats:any):boolean|void;
    ValidateTokenEndpoint(formats:any):boolean|void;

}