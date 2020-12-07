
export interface IVaultConfig {
    host:string;
    port:string;
    tls:boolean | false;
    apiVersion:string;
    endpoint:string;
    pathPrefix:string;
    vaultToken:string;
    customHttpVerb?:boolean;
    namespace?:string;
}

export interface VaultRequestSchema {

        path: {
            type:string;
        },
        method:  {
            type:string;
        },
        header: {
            authorization: {
                name:string;
                value:string;
            },
            contentType:string;
            allowOrigins:string[];
        }

}

export interface SealStatusResponse {

        sealed: boolean;
        t:number;
        n:number;
        progress:number;

}

export interface AuthResponse {

        client_token:string;
        policies:string[];
        metadata:object;
        lease_duration:number;
        renewable:boolean;

}

export interface TokenResponse extends AuthResponse {

}

export interface AppRoleResponse extends AuthResponse {

        client_token:string;
        policies:string[];
        metadata:object;
        lease_duration:number;
        renewable:boolean;
        warnings:string;
        wrap_info:string;
        data:object;
        lease_id:string;

}