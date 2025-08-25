/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { RedisService } from '../../redis/redis.service';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' } })
export class MatchGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly redisService: RedisService) {}

  onModuleInit() {
    void this.redisService
      .getSubscriber()
      .subscribe('match-updates', (message) => {
        const match = JSON.parse(message);
        this.server.to(`match_${match.matchId}`).emit('update-match', match);
      });
  }

  handleConnection(client: any) {
    const matchId = client.handshake.query.matchId;
    if (matchId) {
      client.join(`match_${matchId}`);
    }
  }
}
