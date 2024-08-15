import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Ip, NotFoundException, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { User } from '../models/users.entity';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request, Response } from 'express';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async findAll(@Ip() ip: string): Promise<User[]> {
        console.log("The caller ip is ", ip);
        return this.usersService.findAll();
    }

    @Get(':data')
    async findOne(
        @Res() res: Response,
        @Param() data: {mobile: string}) {
        try {
            const user = await this.usersService.findOne(data.mobile);
            res.status(HttpStatus.OK).send(JSON.stringify(user));
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json({error: error});
        }
    }

    @Post()
    async login(
        @Req() req: Request,
        @Res() res: Response,
        @Body() user: User,
    ) {
        try {
            const newSession = await this.usersService.login(user, req.ip, req.headers['user-agent']);
            res.status(HttpStatus.OK).send(newSession);
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json({error: error});
        }
    }
}
