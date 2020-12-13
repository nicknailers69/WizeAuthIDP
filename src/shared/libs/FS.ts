// filesystem utility class

import path from "path";
import {v1} from "uuid";
import crypto from "crypto";
import * as fs from "fs";

const receiptPath = path.resolve(__dirname, '../../..', 'receipts');
const dbTable = "fs_receipts";
const gc_after=3600;
const now = new Date(Date.now()).getTime();

export interface FileSystem {
    os:string;
    machineID:string;
    get();
    set(value);
    getFilePath(fileid:string):string;
    getFileMime(fileid:string):FileMime;
    getFileStatus(fileid:string):FileStatus;
    decrypt(fileid, key:string):boolean;
    encrypt(fileid, key:string):boolean;
    readReceipt(fileid):Buffer;
    validateReceipt(fileid):string;
    writeFile(file:File):void;
    readFile(fileid):Buffer;
    toJSON(data:string):object;
    toString(data:Buffer):string;
    toBuffer(data:any):Buffer;
}

export enum FileType {
    KEY,
    RECEIPT,
    TMP,
    CACHE,
    CONFIG
}

export enum FileStatus {
    ENCRYPTED,
    LOCKED,
    UNLOCKED,
    DECRYPTED,
    MARKED_FOR_DELETION,
    COPY,
    SIGNED,
    INVALID,
    NONE

}

export enum FileMime {
    DEFAULT="application/txt",
    JSON="application/json",
    JPEG="image/jpeg",
    PNG="image/png",
    HTML="application/html",
    ENCRYPTED="wyzerApplication/enc",
    DECRYPTED="wyzerApplication/dec",
    RECEIPT="wyzerApplication/recpt"
}

export interface FSFile  {
    fileType:FileType;
    status?:FileStatus;
    mime:FileMime;
    path:string;
    receiptID?:string;
    key?:string;
    binary?:boolean;
    text?:boolean;
    encoding?:"utf8";
    origName?:string;

}

export class File implements FSFile {
    fileType: FileType;
    mime: FileMime;
    path: string;
    receiptID?: string;
    status?: FileStatus;
    encoding?:"utf8";
    origName?:string;


    constructor(filename:string, pathTo:string, fileType:FileType, mime:FileMime, receiptID?:string,status?:FileStatus) {
            this.origName = filename;
            this.path = pathTo;
            this.fileType = fileType;
            this.mime = mime;
            this.receiptID = receiptID || null;
            this.status = status || null;
            this.encoding = "utf8";
    }

    get():File {
        return this;
    }



}

export class FS implements FileSystem {

    readonly workPath:string;
    readonly homeDir:string;
    file:File;
    directories: string[];
    files: string[];
    machineID: string;
    os: string;
    receipts: string[];
    current_id:string;
    action:string;
    key:any;
    fileData:any;

    constructor(action:string, data?:any, current_id?:string, workFile?:File) {

        this.action = action;

        if(workFile) {
            this.current_id = v1().toString();
            this.file = workFile.get();
            this.fileData = data;

        } else {
            this.current_id = current_id;
        }

        this.dispatcher().catch(err => console.error(err));

    }

    dispatcher():Promise<any> {

        switch(this.action) {
            case 'write':
                return Promise.resolve(this.writeFile(this.file));

            case 'read':
                this.readFile(this.current_id);
                break;
            case 'lock':
                this.encrypt(this.current_id, this.key);
                break;
            case 'unlock':
                this.decrypt(this.current_id, this.key);
                break;
            case 'verify_integrity':
                this.validateReceipt(this.current_id);
                break;
            default:
                break;
        }

    }

    public static runGC() {
       FS.gc();
    }

    public static createNewFile(filename:string, data:any, pathTo:string, fileType:FileType, mime:FileMime) {

        const file = new File(filename, pathTo, fileType, mime);
        return new FS("write", data,null, file);


    }

    decrypt(fileid, key: string): boolean {
        return false;
    }

    encrypt(fileid, key: string): boolean {
        return false;
    }

    static gc(): void {
    }

    get() {
        return this;
    }

    getFileMime(fileid: string): FileMime {
        return undefined;
    }

    getFilePath(fileid: string): string {
        return "";
    }

    getFileStatus(fileid: string): FileStatus {
        return undefined;
    }

    readFile(fileid): Buffer {
        return undefined;
    }

    readReceipt(fileid): Buffer {
        return undefined;
    }

    set(value) {
    }

    toBuffer(data: any): Buffer {
        return undefined;
    }

    toJSON(data: string): object {
        return undefined;
    }

    toString(data:Buffer):string {

    }

    validateReceipt(fileid): string {
        return "";
    }

    writeFile(file: File): Promise<boolean |void> {

        const fileName = path.resolve(file.path, file.origName);
        const data = this.fileData;
        const dataHash = crypto.createHash('sha256').update(Buffer.from(data)).toString();
        const receiptID = v1().toString();
        return new Promise((resolve, reject) => {
            fs.writeFile(fileName, data, (err) => {
                if(err) {
                    reject(err);
                }
                fs.writeFileSync(path.resolve(`${receiptPath}`, `${fileName.replace(".","_")}-${receiptID}.recpt`), dataHash);
                resolve(true);

            })
        })

    }



}