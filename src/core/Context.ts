import {DEFAULT_SCOPES, DEFAULT_CLAIMS,OpenIDProviderMetadata, ResponseTypesEnum} from "../shared/interfaces/OpenIDConnect";
import {InjectableSingleton} from "../shared/decorators/Injectable";
import {Connection} from "../models/src";


export type DefaultContext = {
    readonly active_client:string | null;
    readonly OIDContext:OpenIDProviderMetadata;
    readonly db:any;
};

@InjectableSingleton("Context")
export class Context{


    active_client: null
    OIDContext: {
        issuer: "",
        authorization_endpoint: "",
        token_endpoint: "",
        userinfo_endpoint: "",
        jwks_uri: "",
        scopes_supported: string[],
        response_types_supported: [ResponseTypesEnum.ID_TOKEN, ResponseTypesEnum.CODE_TOKEN, ResponseTypesEnum.ID_TOKEN_TOKEN, ResponseTypesEnum.ID_TOKEN_TOKEN],
        subject_types_supported: string[],
        id_token_signing_alg_values_supported: ["RS256"],
        claims_supported: string[]
    }

    constructor() {

        this.create();

    }

    create(): any{

        
            this.active_client = null
            this.OIDContext = {
                issuer: "",
                authorization_endpoint: "",
                token_endpoint: "",
                userinfo_endpoint: "",
                jwks_uri: "",
                scopes_supported: DEFAULT_SCOPES.split(","),
                response_types_supported: [ResponseTypesEnum.ID_TOKEN, ResponseTypesEnum.CODE_TOKEN, ResponseTypesEnum.ID_TOKEN_TOKEN, ResponseTypesEnum.ID_TOKEN_TOKEN],
                subject_types_supported: [],
                id_token_signing_alg_values_supported: ["RS256"],
                claims_supported: DEFAULT_CLAIMS.split(",")
        }
        
        return this;
        

    }

    

}

