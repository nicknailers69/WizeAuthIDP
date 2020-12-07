import {Fetcher} from "../libs/fetcher";
import {Vault} from "../libs/vault";


const VAULT_ADDR = process.env.VAULT_ADDR;
const UNSEAL_KEY = process.env.UNSEAL_KEY;
const VAULT_TOKEN = process.env.WIZE_VAULT_API_TOKEN;

const vault = Vault.getInstance(VAULT_ADDR, VAULT_TOKEN, UNSEAL_KEY);

export class VaultAPI {


    readonly vault:Vault=vault;

    constructor() {

        this.initializeVault().then((r) => {console.log(r)}).catch(err => console.log(err));

    }

    initializeVault() {

        return new Promise((resolve, reject) => {
           this.vault.checkHealthStatus().then((s:any) => {
               console.log(s);
               if(s.initialized === true) { resolve(true); } else
               {
                   this.vault.init().then((r => {
                       resolve(r);
                   })).catch(err => reject(err))
               }
           }).catch(err => reject(err));
        });

    }


}

