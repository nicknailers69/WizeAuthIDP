export enum Scopes{
    "openid"=0,
    "photos"=1,
    "offline"=2,
    "reactions"=3,
    "comments"=4,
    "feed"=5,
    "groups"=6,
    "pages"=7,
    "apps"=8,
    "post_on_behalf"=9,
    "friends"=10,
    "followers"=11,
    "geoloc"=12,
    "tags"=13,
    "interests"=14
}

export enum GrantTypes {
    "implicit"=0,
    "refresh_token"=1,
    "authorization_code"=2,
    "password"=3,
    "client_credentials"=4
}

export enum ResponseType {
    "id_token"=0,
    "code"=1,
    "token"=2
}

export enum ScopePermissionsLevel {
    "public"=0,
    "private"=1,
    "friends"=2,
    "custom"=3
}

export enum ScopePermissions {
    "read"=0,
    "write"=1,
    "update"=3,
    "delete"=3
}

export const LoginPath:string = "";
export const ConsentPath:string = "";
export const LogoutPath:string = "";
export const SessionsPath:string = "";