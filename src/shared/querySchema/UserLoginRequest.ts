import * as Joi from 'joi'
import {
    ContainerTypes
} from 'express-joi-validation'

export interface UserLoginRequest {
    [ContainerTypes.Query]:{
        _email:string;
        _password:string;
        _challenge:string;
        _session_id:string;
        _client_id?:string;
        _remember?:boolean;
    }
}

export const querySchema = Joi.object({
    _email:Joi.string().required(),
    _password:Joi.string().required(),
    _csrf:Joi.string().required(),
    _challenge:Joi.string().required(),
    _session_id:Joi.string().required(),
    _client_id:Joi.string().optional(),
    _remember:Joi.bool().optional()
});
