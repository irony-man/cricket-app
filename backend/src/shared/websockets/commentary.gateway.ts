import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { RedisService } from '../../redis/redis.service';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' } })
export class CommentaryGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly redisService: RedisService) {}

  onModuleInit() {
    void this.redisService
      .getSubscriber()
      .subscribe('commentary-updates', (message) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const commentary = JSON.parse(message);
        this.server
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          .to(`match_${commentary.matchId}`)
          .emit('new-commentary', commentary);
      });
  }

  handleConnection(client: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const matchId = client.handshake.query.matchId;
    if (matchId) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      client.join(`match_${matchId}`);
    }
  }
}
