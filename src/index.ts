import "reflect-metadata";
import { ServerMachine } from "./shared/libs/ServerMachine";
import { Connection } from "./models/src";
import { User } from "./models/src/entity/User";
import { Client } from "./models/src/entity/Client";
import { Auth } from "./models/src/entity/Auth";
import { AccessToken } from "./models/src/entity/AccessToken";
import { Consent } from "./models/src/entity/Consent";

const serverInfo = new ServerMachine();

import {Application} from "./Application";

Connection().then(conn => {
  const app = new Application(conn).getApp();

  app.listen(3333);
});

