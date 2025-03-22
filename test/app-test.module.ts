import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesModule } from '../src/movies/movies.module';
import { ShowtimesModule } from '../src/showtimes/showtimes.module';
import { BookingsModule } from '../src/booking/bookings.module';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';

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
      entities: [__dirname + '/../src/**/*.entity.{ts,js}'],
      autoLoadEntities: true,
      synchronize: true,
      dropSchema: true,
    }),
    MoviesModule,
    ShowtimesModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppTestModule {}
