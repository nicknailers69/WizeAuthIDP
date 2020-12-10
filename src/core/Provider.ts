import { Json } from "src/shared/interfaces/JsonArray";
import { OpenIDProviderMetadata } from "../shared/interfaces/OpenIDConnect";

export class Provider implements OpenIDProviderMetadata {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  jwks_uri: string;
  scopes_supported: string[];
  response_types_supported: Json;
  response_modes_supported?: Json;
  grant_types_supported?: Json;
  acr_values_supported?: Json;
  subject_types_supported: Json;
  id_token_signing_alg_values_supported: Json;
  id_token_encryption_alg_values_supported?: Json;
  id_token_encryption_enc_values_supported?: Json;
  userinfo_signing_alg_values_supported?: Json;
  userinfo_encryption_alg_values_supported?: Json;
  userinfo_encryption_enc_values_supported?: Json;
  request_object_signing_alg_values_supported?: Json;
  request_object_encryption_alg_values_supported?: Json;
  request_object_encryption_enc_values_supported?: Json;
  token_endpoint_auth_methods_supported?: Json;
  token_endpoint_auth_signing_alg_values_supported?: Json;
  display_values_supported?: Json;
  claim_types_supported?: Json;
  claims_supported: Json;
  service_documentation?: string;
  claims_locales_supported?: string[];
  ui_locales_supported?: string[];
  claims_parameter_supported?: boolean;
  request_parameter_supported?: boolean;
  request_uri_parameter_supported?: boolean;
  require_request_uri_registration?: boolean;
  op_policy_url?: string;
  op_tos_url?: string;
  

  constructor(issuer: string, authorization_endpoint: string, userinfo_endpoint: string, jwks_uri: string, scopes_supported: string[],
    response_types_supported: Json, subject_types_supported: Json,
    id_token_signing_alg_values_supported: Json, claims_supported: Json, claims_locales_supported?:string[], ui_locales_supported?:string[]) {
    
    this.issuer = issuer;
    this.authorization_endpoint = authorization_endpoint;
    this.userinfo_endpoint = userinfo_endpoint;
    this.jwks_uri = jwks_uri;
    this.scopes_supported = scopes_supported;
    this.response_types_supported = response_types_supported;
    this.subject_types_supported = subject_types_supported;
    this.id_token_signing_alg_values_supported = id_token_signing_alg_values_supported;
    this.claims_supported = claims_supported;
    this.claims_locales_supported = ['EN-US', 'EN', 'EN-GB', 'FR-FR', 'FR-CA'];
    this.ui_locales_supported = ['en-us'];

    
  }
  
  get Issuer() {
    return this.issuer;
  }

  get AuthorizationEndpoint() {
    return this.authorization_endpoint;
  }

  get UserInfoEndpoint() {
    return this.userinfo_endpoint;
  }

  get JwksURI() {
    return this.jwks_uri;
  }

  get ScopesSupported() {
    return this.scopes_supported;
  }

  get ResponseTypesSupported() {
    return this.response_types_supported;
  }

  get SubjectTypesSupported() {
    return this.subject_types_supported;
  }

  get IDTokenSigningAlgValuesSupported() {
    return this.id_token_signing_alg_values_supported;
  }

  get ClaimsSupported() {
    return this.claims_supported;
  }

  set OpPolicyURL(value: string) {
    this.op_policy_url = value;
  }

  get OpPolicyURL() {
    return this.op_policy_url;
  }

  get OpTOSURL() {
    return this.op_tos_url;
  }

}