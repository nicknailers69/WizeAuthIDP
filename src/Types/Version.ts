export type Version = {
    Version:string;
}

export interface IVersion {
    Validate(format:any):void;
}