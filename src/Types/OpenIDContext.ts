export type OpenIDContext = {
   ACRValues?: string[]; // acr value
   Display?: string;
   IDTokenHintClass?:IDTokenHintClass;
   LoginHint?: string[];
   UILocales: string[];
}

export interface IDTokenHintClass {}

export interface IOpenIDContext {
    Validate(formats:any):void;
    toJSONBuffer(item:any):Buffer | void;
    bufferToJson(item:Buffer):object;
}