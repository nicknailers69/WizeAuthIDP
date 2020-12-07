export type ConsentRequestSessionData = {
    AccessToken:Map<string,any>;
    IDToken?:Map<string, any>;
}

export function NewConsentRequestSessionData():ConsentRequestSessionData {
    return {
        AccessToken:new Map(),
        IDToken:new Map()
    }
}