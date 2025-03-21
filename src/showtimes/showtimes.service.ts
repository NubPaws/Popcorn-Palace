import { BadRequestException, Injectable } from '@nestjs/common';
import { ShowtimesRepository } from './showtimes.repository';
import { Showtime } from './entities/showtime.entity';
import { MoviesRepository } from '../movies/movies.repository';
import { Movie } from '../movies/entities/movie.entity';

class InvalidStartOrEndTimeException extends BadRequestException {
  constructor(startTime: Date, endTime: Date, duration: number) {
    super(
      `Showtime's startTime (${startTime}) and endTime (${endTime}) ` +
        `don't match the movie's duration (${duration} minutes).`,
    );
  }
}

function areTimesValid(startTime: Date, endTime: Date, { duration }: Movie) {
  const movieEndTimeMs = startTime.getTime() + duration * 60 * 1000;
  const endTimeMs = endTime.getTime();

  console.log(movieEndTimeMs, endTimeMs, startTime, endTime, duration);

  return movieEndTimeMs <= endTimeMs;
}

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
    const movie = await this.moviesRepository.getMovieById(showtime.movieId);

    // Check that the movie exists here.
    if (!movie) {
      throw new BadRequestException(
        `Movie #${showtime.movieId} does not exist in the database`,
      );
    }

    // Make sure that the time the show starts and end match with the movie's duration.
    if (!areTimesValid(showtime.startTime, showtime.endTime, movie)) {
      throw new InvalidStartOrEndTimeException(
        showtime.startTime,
        showtime.endTime,
        movie.duration,
      );
    }

    return this.showtimesRepository.addShowtime(showtime);
  }

  async update(
    showtimeId: number,
    updates: Partial<Showtime>,
  ): Promise<Showtime> {
    const showtime = await this.find(showtimeId);
    if (!showtime) {
      throw new BadRequestException(`Showtime #${showtimeId} does not exist`);
    }

    const movieId = updates.movieId ?? showtime.movieId;
    const movie = await this.moviesRepository.getMovieById(movieId);
    if (!movie) {
      throw new BadRequestException(`Movie #${movieId} does not exist`);
    }

    const startTime = updates.startTime ?? showtime.startTime;
    const endTime = updates.endTime ?? showtime.endTime;
    if (!areTimesValid(startTime, endTime, movie)) {
      throw new InvalidStartOrEndTimeException(
        startTime,
        endTime,
        movie.duration,
      );
    }

    return this.showtimesRepository.updateShowtime(showtimeId, updates);
  }

  async remove(showtimeId: number): Promise<void> {
    this.showtimesRepository.deleteShowtime(showtimeId);
  }
}
