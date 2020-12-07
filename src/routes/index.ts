import 'reflect-metadata';
import PublicControllers from "../controllers/Public";
import * as Express from "express";

export interface RouteDefinition {
    path:string;
    requestMethod: 'get' | 'post' | 'options' | 'put' | 'delete';
    middleware:any;
    methodName: string;
}



const controllers = Object.keys(PublicControllers);

export default (app:Express.Application) => [PublicControllers].forEach((controller, index) =>{

    const objectValues = Object.values(controller);
    objectValues.forEach(c => {
       // console.log(c);
        const instance = new c.default();
        const prefix = Reflect.getMetadata('prefix', c.default);

        const routes: Array<RouteDefinition> = Reflect.getMetadata('routes', c.default);

        routes.forEach(route => {
            console.log(prefix+route.path);
            switch(route.requestMethod) {
                case 'get':
                    app[route.requestMethod](prefix + route.path,  (req:Express.Request, res:Express.Response) => {
                    instance[route.methodName](req,res);
                });
                    break;
                case 'post':
                    app.post(prefix + route.path, route.middleware, (req:Express.Request, res:Express.Response, next:Express.NextFunction) => {
                    instance[route.methodName](req,res);
                });
                    break;
            }

        })
    })



});
