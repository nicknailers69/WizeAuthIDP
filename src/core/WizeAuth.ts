import {Context, DefaultContext} from "./Context";
import {Injectable} from "../shared/decorators/Injectable";
import {InjectProperty} from "../shared/decorators/InjectProperies";
import * as typeorm from "typeorm";



export interface IWizeAuth {
    _ctx:Context;
}

@Injectable()
export class WizeAuth implements IWizeAuth {



    _ctx:Context;
    ctx:DefaultContext;
    db:any

    constructor() {
        this._ctx = new Context();
        this._ctx.injectDatabaseInContext().then((ctx:DefaultContext) =>{
            this.ctx = ctx;
            this.db = this.getDB();

        })



    }

    addCtx(key:string, value:string) {
        this.ctx[key] = value;
    }

    getDB() {
        return this.ctx.db;
    }

}