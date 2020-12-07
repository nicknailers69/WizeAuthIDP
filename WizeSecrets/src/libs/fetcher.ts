import * as http from "http";
import * as https from "https";
import AbortController from "abort-controller";
import {Headers} from "node-fetch";

const fetch = require('node-fetch');
const bluebird = require('bluebird');
const controller = new AbortController();
const timeout = setTimeout(
    () => { controller.abort(); },
    150,
);

fetch.Promise = bluebird;

export class Fetcher {


    protected fetch:any;
    protected headers:any;
    protected headersCopy:any;
    protected httpAgent:http.Agent | undefined;
    protected httpsAgent:https.Agent | undefined;

    constructor(useSSL:boolean=false) {
        this.fetch = fetch;
        this.headers = new Map();

        if(!useSSL) {
            this.setAgent();
        } else {
            this.setSSLAgent();
        }

        this.initializeFetch();

    }

    private setHeader(key:string, value:any):void {
        this.headers.set(key, value);
    }

    private convertMapToHeaders():Headers {
        return new Headers(this.headers);
    }

    private copyHeaders() {
        this.headersCopy = new Headers(this.headers);
    }

    private setAgent():void {
        this.httpAgent = new http.Agent({keepAlive:true});
    }

    private setSSLAgent():void {
        this.httpsAgent = new https.Agent({keepAlive:true});
    }

    private getAgent(_parsedURL):http.Agent {

            if(_parsedURL.protocol == 'http:') {
                return this.httpAgent;
            } else {
                return this.httpsAgent;
            }

    }

    private setAgentOptions() {
        this.fetch.options = {
            agent: this.getAgent
        }
    }

    private initializeFetch() {
        this.setHeader("Content-Type","application/json");
        const headers = this.convertMapToHeaders();
        this.copyHeaders();
        this.setAgentOptions();
        this.fetch.options.headers = headers;
        this.fetch.options.signal = controller.signal;

    }

    get fetcher() {
        return this.fetch;
    }

    public async Query(url:string, method:string, headers?:any, body?:any):Promise<any> {

        const options = this.prepareRequest(url, method, headers, body);
        let response;
        try {

            response = await this.execute(url, options);
            if(response){
                return response;
            }
        } catch(e) {
            return e;
        }

    }

    private prepareRequest(url:string, method:string, headers?:any, body?:any) {

        const options = {method:method, headers:null, body:null};

        if(headers) {
            headers.forEach((h:any) => {
                this.headers.set(h.name, h.value);
            });

            options.headers =  this.convertMapToHeaders();
           this.copyHeaders();

        }

        if(body){
           options.body = body;
        }

        return options;

    }

    private execute(url:string, options:any):Promise<any> {

        return new Promise((resolve, reject) => {
            this.fetcher(url, options).then(res => res.json()).then((json:any) => {

                    resolve(json);

            }).catch(err => reject(err));
        });

    }


}