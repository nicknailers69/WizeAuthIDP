import "reflect-metadata";
import {ServerMachine} from "./shared/libs/ServerMachine";

const serverInfo = new ServerMachine();

import {Application} from "./Application";

const app = new Application().getApp();

app.listen(3333);