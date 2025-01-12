import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"; 
import { Reflector } from "@nestjs/core"; 
import { JwtService } from "@nestjs/jwt"; 
import { Roles } from "../decorators/roles.decorator";
@Injectable() export class AuthGuard implements CanActivate 
{ 
    constructor(private reflector:Reflector,private jwtService:JwtService,){} 
    
    async canActivate(context: ExecutionContext) 
    { 
        const roles=this.reflector.get(Roles,context.getHandler()); 
        //Api Public 
        if(!roles){return true;} 

        //get token 
        const request=context.switchToHttp().getRequest(); 
        const token = (request.headers.authorization || '   ').split(' ', 2)[1]; 
        if(!token){throw new UnauthorizedException();} 
        
        try 
        { 
            const payload= await this.jwtService.verifyAsync(token,{secret:process.env.JWT_SECRET,});  
            //
            if(payload._id){request.user=payload; return true;}
            //           
            if(roles.includes(payload.role)){return true;} 
            else{throw new UnauthorizedException();} 
        } 
        catch{throw new UnauthorizedException();} 
    } 
}
// import {CanActivate,ExecutionContext,Injectable,UnauthorizedException} from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { JwtService } from '@nestjs/jwt';
// import { Request } from 'express';
// import { Roles } from '../decorators/roles.decorator';
  
// @Injectable()
// export class AuthGuard implements CanActivate 
// {
// constructor(private reflector:Reflector,private jwtService: JwtService) {}
  
// async canActivate(context: ExecutionContext): Promise<boolean> 
// {
//     const roles=this.reflector.get(Roles,context.getHandler()); 
//     //Api Public 
//     if(!roles){return true;} 
    
//     //Api Private get token from header
//     const request = context.switchToHttp().getRequest();
//     const token = this.extractTokenFromHeader(request);
//     if (!token) {throw new UnauthorizedException();}
//     try 
//     {
//     const payload = await this.jwtService.verifyAsync(token,{secret:process.env.JWTKey});
//     // 💡 We're assigning the payload to the request object here
//     // so that we can access it in our route handlers
//     request['user'] = payload;} 
//     catch {throw new UnauthorizedException();}
//     return true;
// }
// private extractTokenFromHeader(request: Request): string | undefined 
// {
// const [type, token] = request.headers.authorization?.split(' ') ?? [];
// return type === 'Bearer' ? token : undefined;
// }
// }  