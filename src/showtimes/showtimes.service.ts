import { BadRequestException, Injectable } from '@nestjs/common';
import { ShowtimesRepository } from './showtimes.repository';
import { Showtime } from './entities/showtime.entity';
import { MoviesRepository } from '../movies/movies.repository';

@Injectable()
export class ShowtimesService {
  constructor(
    private readonly showtimesRepository: ShowtimesRepository,
    private readonly moviesRepository: MoviesRepository,
  ) {}

  async find(showtimeId: number): Promise<Showtime | null> {
    return this.showtimesRepository.getShowtime(showtimeId);
  }

  async add(showtime: Showtime): Promise<Showtime> {
    // Check that the movie exists here.
    if (!(await this.moviesRepository.movieIdExists(showtime.movie.id))) {
      throw new BadRequestException(
        `Movie #${showtime.movie.id} does not exist in the database`,
      );
    }

    return this.showtimesRepository.addShowtime(showtime);
  }

  async update(
    showtimeId: number,
    showtime: Partial<Showtime>,
  ): Promise<Showtime> {
    const { movie } = showtime;
    if (movie && !(await this.moviesRepository.movieIdExists(movie.id))) {
      throw new BadRequestException(
        `Movie #${movie.id} does not exist in the database`,
      );
    }

    return this.showtimesRepository.updateShowtime(showtimeId, showtime);
  }

  async remove(showtimeId: number): Promise<void> {
    this.showtimesRepository.deleteShowtime(showtimeId);
  }
}
