import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Showtime } from './entities/showtime.entity';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesRepository } from './showtimes.repository';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [TypeOrmModule.forFeature([Showtime]), MoviesModule],
  controllers: [ShowtimesController],
  providers: [ShowtimesService, ShowtimesRepository],
})
export class ShowtimesModule {}
