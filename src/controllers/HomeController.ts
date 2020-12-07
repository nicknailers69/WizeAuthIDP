import {Controller} from "../shared/decorators/ControllerClassDecorator";
import {Get} from "../shared/decorators/RoutesDecorator";
import {Request, Response} from "express";

@Controller('/')
export default class HomeController {

    // @ts-ignore
    @Get('/')
    public index(req:Request, res:Response) {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        res.render('home');

    }

}