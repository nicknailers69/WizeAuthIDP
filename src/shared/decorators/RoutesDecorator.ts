import { NextFunction } from 'express';
import 'reflect-metadata';

import {RouteDefinition} from "../../routes";

export const Get = (path:string):MethodDecorator => {
    return (target, propertyKey:string):void => {
        if(!Reflect.hasMetadata('routes', target.constructor)) {
            Reflect.defineMetadata('routes', [], target.constructor);
        }

        const routes = Reflect.getMetadata('routes', target.constructor) as Array<RouteDefinition>;

        routes.push({
            requestMethod:'get',
            path,
            middleware:null,
            methodName: propertyKey
        });
        Reflect.defineMetadata('routes', routes, target.constructor);
    }
}

export const Put = (path:string):MethodDecorator => {
    return (target, propertyKey:string):void => {
        if(!Reflect.hasMetadata('routes', target.constructor)) {
            Reflect.defineMetadata('routes', [], target.constructor);
        }

        const routes = Reflect.getMetadata('routes', target.constructor) as Array<RouteDefinition>;

        routes.push({
            requestMethod:'put',
            path,
            middleware:null,
            methodName: propertyKey
        });
        Reflect.defineMetadata('routes', routes, target.constructor);
    }
}

export const Post = (path:string, middleware?:any):MethodDecorator => {
    return (target, propertyKey:string):void => {
        if(!Reflect.hasMetadata('routes', target.constructor)) {
            Reflect.defineMetadata('routes', [], target.constructor);
        }

        const routes = Reflect.getMetadata('routes', target.constructor) as Array<RouteDefinition>;

        if(!middleware){
            routes.push({
                requestMethod: 'post',
                path,
                middleware: (req, res, next) => { next();},
                methodName: propertyKey
            });
        } else {
            routes.push({
                requestMethod: 'post',
                path,
                middleware,
                methodName: propertyKey
            });
        }
        Reflect.defineMetadata('routes', routes, target.constructor);
    }
}

export const Delete = (path:string):MethodDecorator => {
    return (target, propertyKey:string):void => {
        if(!Reflect.hasMetadata('routes', target.constructor)) {
            Reflect.defineMetadata('routes', [], target.constructor);
        }

        const routes = Reflect.getMetadata('routes', target.constructor) as Array<RouteDefinition>;

        routes.push({
            requestMethod:'delete',
            path,
            middleware:null,
            methodName: propertyKey
        });
        Reflect.defineMetadata('routes', routes, target.constructor);
    }
}