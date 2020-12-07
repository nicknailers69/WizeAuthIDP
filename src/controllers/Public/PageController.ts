import {Controller} from "../../shared/decorators/ControllerClassDecorator";
import {Get} from "../../shared/decorators/RoutesDecorator";
import {Request, Response} from "express";
import {Injectable} from "../../shared/decorators/Injectable";
import csurf from "csurf";

@Controller('/page')
@Injectable()
export default class PageController {

    // @ts-ignore
    @Get('/')
    public index(req:Request, res:Response) {
        return res.status(200).send({'message':'welcome to wizeauth api'});
    }

}