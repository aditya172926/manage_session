import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.body;
    console.log("request data ", user);
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (phoneRegex.test(user.mobile) && user.username)
      return true;
    return false;
  }

}
