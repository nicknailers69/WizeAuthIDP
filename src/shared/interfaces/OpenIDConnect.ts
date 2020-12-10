import {Json} from "./JsonArray";
import {RFC5646} from "./RFC5646";


export type OpenIDProviderMetadata = {
    issuer:string;
    authorization_endpoint:string;
    token_endpoint:string;
    userinfo_endpoint:string;
    jwks_uri:string;
    scopes_supported: string[];
    response_types_supported: Json;
    response_modes_supported?: Json;
    grant_types_supported?: Json;
    acr_values_supported?: Json;
    subject_types_supported: Json;
    id_token_signing_alg_values_supported: Json;
    id_token_encryption_alg_values_supported?:Json;
    id_token_encryption_enc_values_supported?:Json;
    userinfo_signing_alg_values_supported?: Json;
    userinfo_encryption_alg_values_supported?: Json;
    userinfo_encryption_enc_values_supported?: Json;
    request_object_signing_alg_values_supported?: Json;
    request_object_encryption_alg_values_supported?: Json;
    request_object_encryption_enc_values_supported?: Json;
    token_endpoint_auth_methods_supported?: Json;
    token_endpoint_auth_signing_alg_values_supported?: Json;
    display_values_supported?: Json;
    claim_types_supported?:Json;
    claims_supported: Json;
    service_documentation?:string;
    claims_locales_supported?:string[];
    ui_locales_supported?:string[];
    claims_parameter_supported?:boolean;
    request_parameter_supported?:boolean;
    request_uri_parameter_supported?:boolean;
    require_request_uri_registration?:boolean;
    op_policy_url?:string;
    op_tos_url?:string;
}

export enum ResponseModesEnum {
    QUERY,
    FRAGMENT
}

export enum ResponseTypesEnum {
    NONE,
    ID_TOKEN_TOKEN,
    CODE_TOKEN,
    CODE_ID_TOKEN,
    CODE_ID_TOKEN_TOKEN,
    ID_TOKEN
}

export type ResponseTypes = {
    name: string;
    supported: ResponseTypesEnum[];
    is_combined:boolean;
    state?:string;
    client_id?:string;
    redirect_uri?:string;
    access_token?:string;
    token_type?:string;
    id_token?:string;
    expires_in?:string;
}

export const ResponseTypeToFlow = {
   0: "",
    1:"implicit",
    2:"hybrid",
    3:"hybrid",
    4:"hybrid",
    5:"implicit"

}

export enum Authorization_Flows {
    authorization_code,
    implicit,
    hybrid
}

export type Id_Token = {
    iss:string;
    sub:string;
    aud:string|string[];
    exp:string;
    iat:string;
    auth_time:string;
    nonce:string;
    acr?:string;
    amr?:string[];
    azp?:string;
    at_hash?:string;
    c_hash?:string;
    signature?:string;
}

export type Authentication_Request = {
    scope:string;
    response_type:ResponseTypesEnum;
    client_id:string;
    redirect_uri:string;
    state:string;
    response_mode?:ResponseModesEnum;
    nonce?:string;
    display?:'PAGE'|'POPUP'|'TOUCH'|'WAP';
    prompt?:'NONE'|'LOGIN'|'CONSENT'|'SELECT_ACCOUNT';
    max_age?:string;
    ui_locales?:string[];
    id_token_hint?:string;
    login_hint?:string;
    acr_values?:string[];
}

export type Authentication_Response_Success = {
    code:string;
    state?:string;
    redirect_uri?:string;
}

export type Authentication_Response_Error = {
    error_code:string;
    error_description?:string;
    error_uri?:string;
    state?:string;
}

export type Token_Request = {
    grant_type:Authorization_Flows;
    code?:string;
    redirect_uri?:string;
}

export type Token_Response = {
    access_token:string;
    token_type:"Bearer";
    refresh_token:string;
    expires_in:number;
    id_token:string;
    state?:string;
}

export type UserInfoResponse = {
    Birthdate?:string;
    Email?:string;
    EmailVerified?:boolean;
    FamilyName?:string;
    Gender?:string;
    GivenName?:string;
    Locale?:string;
    MiddleName?:string;
    Name?:string;
    Nickname?:string;
    PhoneNumber?:string;
    PhoneNumberVerified?:boolean;
    Picture?:string;
    PreferredUsername?:string;
    Profile?:string;
    Sub?:string;
    UpdatedAt?:number;
    Website?:string;
    Zoneinfo?:string;
    Address?:Address_Claim;
}

export type Address_Claim = {
    formatted:string;
    street_address:string;
    locality:string;
    region:string;
    postal_code:string;
    country:string;
}

export type UserInfoRequest = {
    endpoint:string;
    token:string;
}

export const DEFAULT_CLAIMS = "name,given_name,family_name,email,picture";
export const DEFAULT_SCOPES = "openid,email,offline_access";
export const DEFAULT_LOCALES:Json = ["en-US", "en-GB", "en-CA", "fr-FR", "fr-CA"];

export interface Token {
    jti:string;
    token_class_name:string;
    format:string;
    exp:string;
    iat:string;
    accountId:string;
    clientId:string;
    aud:string[];
    authTime:number;
    claims:string[];
    rejected_claims:string[];
    extra_claims?:string[];
    codeChallenge:string;
    codeChallengeMethod:string;
    sessionUid:string;
    expiresWithSession?:boolean | false;
    grantId?:string;
    nonce?:string;
    redirectUri?:string;
    resource?:string; // | "auth_code" | "device_code" | "refresh_token" type only
    rotations?:number | 0;
    initial_refresh_token_iat?:number;
    acr?:string;
    amr?:string[];
    scope?:string[];
    rejected_scopes?:string[];
    initial_sid_token_from?:string;
    'x5t#S256'?:string;
    jkt?:string;
    gty?:string;
    params?:object;
    user_device_code?:string;
    device_info?:object;
    device_in_flight?:boolean;
    device_error?:string;
    error_description?:string;
    policies?:string[];//InitialAccessToken, RegistrationAccessToken only
    request?:string; //PushedAuthorizationRequest only

}



export type OidcSessionModel = {
    jti:string;
    uid:string;
    kind:"Session";
    exp:number;
    iat:number;
    account:string;
    authorizations:object;
    loginTimestamp:number;
    acr:string;
    amr:string[];
    transient:boolean | true;
    state:object; //ie.: csrf, form submission
}


export enum CredentialEncodingModeEnum  {
  STRICT = 'strict',
  LOOSE = 'loose'
};


export type CredentialsEncoding = {
  encodingMode: CredentialEncodingModeEnum;
}



/**
 * HTTP/1.1 200 OK
 Content-Type: application/json

 {
   "issuer":
     "https://server.example.com",
   "authorization_endpoint":
     "https://server.example.com/connect/authorize",
   "token_endpoint":
     "https://server.example.com/connect/token",
   "token_endpoint_auth_methods_supported":
     ["client_secret_basic", "private_key_jwt"],
   "token_endpoint_auth_signing_alg_values_supported":
     ["RS256", "ES256"],
   "userinfo_endpoint":
     "https://server.example.com/connect/userinfo",
   "check_session_iframe":
     "https://server.example.com/connect/check_session",
   "end_session_endpoint":
     "https://server.example.com/connect/end_session",
   "jwks_uri":
     "https://server.example.com/jwks.json",
   "registration_endpoint":
     "https://server.example.com/connect/register",
   "scopes_supported":
     ["openid", "profile", "email", "address",
      "phone", "offline_access"],
   "response_types_supported":
     ["code", "code id_token", "id_token", "token id_token"],
   "acr_values_supported":
     ["urn:mace:incommon:iap:silver",
      "urn:mace:incommon:iap:bronze"],
   "subject_types_supported":
     ["public", "pairwise"],
   "userinfo_signing_alg_values_supported":
     ["RS256", "ES256", "HS256"],
   "userinfo_encryption_alg_values_supported":
     ["RSA1_5", "A128KW"],
   "userinfo_encryption_enc_values_supported":
     ["A128CBC-HS256", "A128GCM"],
   "id_token_signing_alg_values_supported":
     ["RS256", "ES256", "HS256"],
   "id_token_encryption_alg_values_supported":
     ["RSA1_5", "A128KW"],
   "id_token_encryption_enc_values_supported":
     ["A128CBC-HS256", "A128GCM"],
   "request_object_signing_alg_values_supported":
     ["none", "RS256", "ES256"],
   "display_values_supported":
     ["page", "popup"],
   "claim_types_supported":
     ["normal", "distributed"],
   "claims_supported":
     ["sub", "iss", "auth_time", "acr",
      "name", "given_name", "family_name", "nickname",
      "profile", "picture", "website",
      "email", "email_verified", "locale", "zoneinfo",
      "http://example.info/claims/groups"],
   "claims_parameter_supported":
     true,
   "service_documentation":
     "http://server.example.com/connect/service_documentation.html",
   "ui_locales_supported":
     ["en-US", "en-GB", "en-CA", "fr-FR", "fr-CA"]
  }
 **/