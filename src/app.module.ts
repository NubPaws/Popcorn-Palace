import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MoviesModule } from './movies/movies.module';
import { ShowtimesModule } from './showtimes/showtimes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'popcorn-palace',
      port: parseInt(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'popcorn-palace',
      password: process.env.DATABASE_PASSWORD || 'popcorn-palace',
      database: process.env.DATABASE_NAME || 'popcorn-palace',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true, // TODO: Disable this in production mode.
    }),
    MoviesModule,
    ShowtimesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
