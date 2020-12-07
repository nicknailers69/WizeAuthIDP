
export interface OsInfo {
    os_type:string;
    os_version:string;
    os_dist?:string;
    os_homedir?:string;
    os_tmpdir?:string;
}

export interface MachineInfo {
    timezone?:number;
    timezone_iana?:string;
    locale?:string;
    machine_raw_id?:string;
    machine_id_hash:string;
    cpus_available:number;
    cpus_can_use:number;
    total_ram:number;
    ram_available:number;
    current_load:string;
    peak_load:string;
    machine_time:string | number;
    time_utc:string | number;
    checksum:string;
    signature:string;
}

export type ServerEnvironment = {
    id:string;
    friendly_name:string;
    hostname:string;
    ip:string;
    machine:MachineInfo;
    os:OsInfo;
    status:string;
    services_available:string[];
    uptime:string;
    cluster_id?:string;
    zone_id?:string;
    consul_info?:string;
    vault_info?:string;
}

