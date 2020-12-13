import path from "path";

const rootPath =  path.resolve(__dirname, '../..');
const srcPath = rootPath+"/src";

export const Paths = {
    rootPath: rootPath,
    srcPath: srcPath,
    shared: srcPath + '/shared',
    view: rootPath + '/views',
    keys: rootPath + '/.keys',
    jwks: srcPath + '/.keys',
    assets: rootPath + '/public',
    ntruLibs: rootPath + '/lib',
    tmp: rootPath + '/tmp',
    uploads: rootPath + '/uploads',
    receipts: rootPath + '/receipts'
};

