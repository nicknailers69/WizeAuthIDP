// filesystem utility class

export class FS {

    readonly workPath:string;
    readonly homeDir:string;
    protected isEncrypted:boolean;
    protected isSigned:boolean;
    protected isSignatureValid:boolean;


}

export interface FileSystem {
    os:string;
    machineID:string;

}