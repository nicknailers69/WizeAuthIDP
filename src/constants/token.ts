import Moment from "moment";
import * as nanoid from 'nanoid';


export const DEFAULT_TOKEN_TYPE = 'id_token';
export const EXPNUMBER = Moment.duration(1, 'day').asMilliseconds();
export const ISSUER = "https://wyzer.wizegene.com";
export const JIT = nanoid.nanoid(32);
export const NONCE = nanoid.nanoid(16);
export const AUDIENCE = "https://swaggit.net";
export const ISSUEAT = Moment().milliseconds();

export const ID_TOKEN_CLAIMS = {
    jti: JIT,
    exp: EXPNUMBER,
    iss: ISSUER,
    aud: AUDIENCE,
    iat:ISSUEAT,
    nonce:NONCE,
    sub:"",
    userinfo:""
}

