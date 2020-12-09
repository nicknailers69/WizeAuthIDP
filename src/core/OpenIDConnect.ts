import * as events from "events";
import { NextFunction, Request, Response } from "express";
import { InjectableSingleton } from "src/shared/decorators/Injectable";


@InjectableSingleton("OpenIDConnect")
export class OpenIDConnect extends events.EventEmitter {

  protected _conn: any;
  protected _context: any;
  protected _knownUser: boolean;
  protected _policies:any = {policies: {loggedIn:false}, models:""};

  constructor(conn:any,context:any) {
    super();

    this._conn = conn;
    this._context = context;
    this._knownUser = false;

  }


  async LoginMW(req:Request, res:Response, next:NextFunction) {
    
    const self = this;

    const { email, password } = req.body;


  }
  



}