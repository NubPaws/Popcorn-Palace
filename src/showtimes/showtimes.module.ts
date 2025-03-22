import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Showtime } from './showtime.entity';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesRepository } from './showtimes.repository';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [TypeOrmModule.forFeature([Showtime]), MoviesModule],
  controllers: [ShowtimesController],
  providers: [ShowtimesService, ShowtimesRepository],
  exports: [ShowtimesRepository],
})
export class ShowtimesModule {}
