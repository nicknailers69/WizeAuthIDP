export interface Manager  {
    store:Storage;
    Authenticate(ctx:any, id:string):any;
}

export interface Storage {
    GetClient(ctx:any, id:string):any;
    CreateClient(ctx:any):any;
    UpdateClient(ctx:any, c:any):void;
    DeleteClient(ctx:any, c:any):void;
    GetClients(ctx:any, limit:number, offset:number):any[];
    CountClients(ctx:any):number | void;
    GetConcreteClient(ctx:any, id:string):Promise<any | void>;
}