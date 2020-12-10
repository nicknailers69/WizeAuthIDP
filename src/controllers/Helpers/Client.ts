
import { Client } from "../../models/src/entity/Client";
import crypto from "crypto";
import PKCE from "pkce-challenge";
import * as  UUID from "uuid";
import { User } from '../../models/src/entity/User';

export class ClientHelper {


  protected _conn: any;

  constructor(conn: any) {
      
    this._conn = conn;

  }
  
  createClient(clientData: any) {
    return new Promise((resolve, reject) => {
    const client = new Client();
    client.Key = this.generateClientKey().substr(0, 32).replace("-", "");
    client.Secret = this.generateClientSecret();
    client.Name = clientData.name ? clientData.name : "";
    client.Image = "";
    client.redirect_uris = "";
    client.credentialsFlow = true;
    client.User = clientData.id;

  
      this._conn.getRepository(Client).save(client).then((c: Client) => {
        console.log(c);
        resolve(c);
      }).catch(e => {
        console.log(e); reject(e);
      });
    });
   

  }

  generateClientKey() {

    return UUID.v1().toString().replace("-", "");

  }

  generateClientSecret() {

    const secret = PKCE(43);
    return secret.code_challenge + ":" + secret.code_verifier;

  }

}

