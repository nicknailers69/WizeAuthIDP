export type InternalRegistry = {
    RegistryWriter:Function;

}

export interface Registry {
    ClientValidator():any;
    ClientManager():any;
    ClientHasher():string;
}