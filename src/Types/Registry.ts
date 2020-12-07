export type InternalRegistry = {
    writerFunc:Function;
    cookieStorage:any;
    registryLogger:any;
    Registry:Registry;

}

export interface Registry {
    ConsentManager();
    ConsentStrategy();
    SubjectIdentifierAlgorithm() : Map<string, SubjectIdentifierAlgorithm>;
}

export interface SubjectIdentifierAlgorithm {
    Obfuscate(subject:string, client:any):string|void;
}

export type SubjectIdentifierAlgorithmPublic = {
    impl:SubjectIdentifierAlgorithm;
};

