import * as fs from "fs";
import * as path from "path";
import {InjectableSingleton} from "../decorators/Injectable";


@InjectableSingleton("Config")
export class ConfigParser {

    readonly rawConfigJSON:any;
    private parsed:any;
    readonly configPath = path.resolve(__dirname, "../../config");

    constructor(configFile:any="configuration.json") {

        this.rawConfigJSON = path.resolve(this.configPath, configFile);
        this.readConfig();

    }

    readConfig = () => {

        this.parsed = JSON.parse(fs.readFileSync(this.rawConfigJSON).toString());

    }


    public getConfig() {
        return this.parsed;
    }



}

export default new ConfigParser("configuration.json");