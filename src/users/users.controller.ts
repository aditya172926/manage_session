import { Body, Controller, Delete, Get, HttpCode, Ip, NotFoundException, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { User } from '../models/users.entity';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async findAll(@Ip() ip: string): Promise<User[]> {
        console.log("The caller ip is ", ip);
        return this.usersService.findAll();
    }

    @Get(':id')
    async findOne(@Param() id: any): Promise<User> {
        return this.usersService.findOne(id.id);
    }

    @UseGuards(AuthGuard)
    @Post()
    @HttpCode(201)
    async createUser(
        @Req() req: Request,
        @Body() user: User,
    ): Promise<User> {
        const createdUser = await this.usersService.signup(user, req.ip);
        return createdUser;
    }

    // @UseGuards(AuthGuard)
    // @Post('login')
    // async login() {

    // }

    @Put(':id')
    async update(@Param('id') id: string, @Body() user: User): Promise<any> {
        await this.usersService.update(id, user);
        return { message: 'User updated successfully' };
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<any> {
        const user = await this.usersService.findOne(id);

        if (!user) {
            throw new NotFoundException('User does not exist!');
        }

        await this.usersService.delete(id);
        return { message: 'User deleted successfully' };
    }
}
