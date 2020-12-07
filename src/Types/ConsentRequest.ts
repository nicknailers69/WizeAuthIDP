import {OAuth2Client} from "./OAuth2Client";
import {OpenIDContext} from "./OpenIDContext";

export type ConsentRequest = {
   ID:string;
   RequestedScope: string[];
   RequestedAudience: string[];
   Skip:boolean;
   Subject:string;
   OpenIDConnectContext:OpenIDContext;
   Client:any;
   ClientID:string;
   RequestURL:string;
   LoginChallenge:string | void;
   LoginSessionID:string |  void;
   ACR:string;
   Context:string;
   ForceSubjectIdentifier:string;
   SubjectIdentifier:string;
   Verifier:string;
   CSRF:string;
   AuthenticatedAt:string | void;
   RequestedAt:string;
   WasHandled:boolean;
}
