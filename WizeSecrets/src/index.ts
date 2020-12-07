/**
 *  @module WizeSecrets
 *  @version 0.0.1
 *  @description Hashicorp Vault secrets engine api wrapper used in the WizeAuth OpenID / Authentication server and IDP
 *  @author Nicolas Cloutier <mailto:nicknailers69@gmail.com>, CEO, Swaggit Inc.
 *  @license MIT
 *
 */

import {config} from "dotenv";

config();


import {VaultAPI} from "./api";


const API = new VaultAPI();


