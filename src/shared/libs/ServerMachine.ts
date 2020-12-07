import {MachineInfo, ServerEnvironment, OsInfo} from "../interfaces/OsInfo";
import * as os from "os";
import * as path from "path";
import * as plist from "plist"; //for darwin macOS systems
import * as getOS from "getos";
import {InjectableSingleton} from "../decorators/Injectable";
import * as uniqueMachineID from 'node-unique-machine-id';
import {DateTime} from "luxon";

@InjectableSingleton("ServerMachine")
export class ServerMachine implements ServerEnvironment {
    cluster_id: string;
    consul_info: string;
    friendly_name: string;
    hostname: string;
    id: string;
    ip: string;
    machine: MachineInfo;
    os: OsInfo;
    services_available: string[];
    status: string;
    uptime: string;
    vault_info: string;
    zone_id: string;

    constructor() {

            this.initializeServerInfo().then(info => {/*console.log(info);*/}).catch(err => {
                console.log(err);
                process.exit(999);
            })


    }

    private async setOSInfo():Promise<any> {

        let info;

        try  {

            if(os.platform() === "linux"){
                info = await getOS;
                if (info){
                    this.os.os_type = info.os;
                    this.os.os_dist = info.dist || null;
                    this.os.os_version = info.release;

                }
            }

            else if(os.platform() === "darwin") {
                    this.os.os_type = "darwin";
                    this.os.os_dist = os.release();
                    this.os.os_version = os.version();
            }

            else if(os.platform() !== "linux" && os.platform() !== "darwin") {
                const err = new Error('server platform is not supported ('+os.platform()+'). If you are trying to run this application for development purpose, use docker-compose with the provided docker-compose.yml file. Will now exit.');
                console.error(err);
                process.exit(999);
            }
            this.os.os_homedir = path.resolve(os.homedir());
            this.os.os_tmpdir = path.resolve(os.tmpdir());
            this.uptime = os.uptime().toString(10);

            console.info(this.os);
            return this.os;

        } catch(e) {
            return e;
        }


    }

    private setMachineInfo():void {

        let info;
        const dt = DateTime.local();
        this.machine.machine_raw_id = uniqueMachineID.machineSync(true);
        this.machine.machine_id_hash = uniqueMachineID.machineSync();
        this.machine.cpus_available = os.cpus().length;
        this.machine.cpus_can_use = Math.floor((os.cpus().length / 1.2)); // will round the number of cpus / 1.2 to the lowest number so we have enough resources to run other services on the server
        this.machine.ram_available = os.freemem();
        this.machine.total_ram = os.totalmem();
        this.machine.timezone = dt.offset;
        this.machine.timezone_iana = dt.zoneName;
        this.machine.locale = dt.locale;
        this.machine.current_load = JSON.stringify(os.loadavg());
        this.machine.peak_load = "not implemented";
        this.machine.machine_time = dt.toSeconds();
        this.machine.time_utc = DateTime.utc().toSeconds();
        console.log(this.machine);

    }
    
    private async initializeServerInfo() {
        
        this.os = {
            os_type:"",
            os_version:"",
            os_dist:"",
            os_homedir:"",
            os_tmpdir:""
        };
        
        this.machine = {
            timezone:0,
            timezone_iana:"",
            locale:"",
            machine_raw_id:"",
            machine_id_hash:"",
            cpus_available:0,
            cpus_can_use:0,
            total_ram:0,
            ram_available:0,
            current_load:"",
            peak_load:"",
            machine_time:"",
            time_utc:"",
            checksum:"",
            signature:"",
        }

        this.hostname = os.hostname();



        let info;
        try {
            info = await this.setOSInfo();
            if(info) {
                this.setMachineInfo();
                if(this.os.os_type === "darwin") {
                    this.ip = os.networkInterfaces()["en1"][1].address;
                } else{
                    this.ip = os.networkInterfaces()["eth0"][0].address;
                }
                return this;
            }
        } catch(err) {
            return err;
        }

        
    }

}


