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


    constructor() {

    }

    create(conn:any): any{

        return {
            active_client: null,
            db:conn,
            OIDContext: {
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
        }

    }

    injectDatabaseInContext() {

        return new Promise((resolve, reject) => {
            Connection().then(conn => {
                const context = this.create(conn);
                resolve(context);
            }).catch(err => {
                console.log(err);
                reject(err);
            });

        })

    }

}

