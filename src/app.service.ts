import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  getHello(): string {
    return 'Hello Worlds!';
  }

  async test(): Promise<string> {
    return "whatsup"
  }

  private generateSessionKey(): string {
    return "";
  }

}
