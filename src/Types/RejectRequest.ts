export type RejectRequest = {
    Error?:string;
    ErrorDebug?:string;
    ErrorDescription?:string;
    ErrorHint:string;
    StatusCode:number;
}