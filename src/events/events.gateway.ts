import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';

@WebSocketGateway({cors: true})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  httpServer = createServer();
  @WebSocketServer() server: Server;

  handleConnection(client: any, ...args: any[]) {
    console.log("Client connected ", client.id);
  }

  handleDisconnect(client: any) {
    console.log("Client disconnected ", client.id);
  }

  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, payload: string): string {
    console.log(`Message received ${payload} from client ${client}`);
    return "Message received " + payload;
  }
}
