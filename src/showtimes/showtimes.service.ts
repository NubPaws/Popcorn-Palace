import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ShowtimesRepository } from './showtimes.repository';
import { Showtime } from './showtime.entity';
import { MoviesRepository } from '../movies/movies.repository';
import { CreateShowtimeDto, UpdateShowtimeDto } from './showtimes.dto';

@Injectable()
export class ShowtimesService {
  constructor(
    private readonly showtimesRepository: ShowtimesRepository,
    private readonly moviesRepository: MoviesRepository,
  ) {}

  /**
   * Retrieves a showtime by its ID.
   *
   * @param showtimeId The ID of the showtime to retrieve.
   * @returns The found showtime entity.
   * @throws NotFoundException if the showtime does not exist.
   */
  async find(showtimeId: number): Promise<Showtime | null> {
    const showtime = await this.showtimesRepository.getShowtime(showtimeId);
    if (!showtime) {
      throw new NotFoundException(`Showtime #${showtimeId} does not exist`);
    }

    return showtime;
  }

  /**
   * Adds a new showtime.
   *
   * Validates that:
   * The associated movie exists.
   * The start time is before the end time.
   *
   * @param createShowtimeDto Data Transfer Object containing the showtime details.
   * @returns The newly created showtime entity.
   * @throws BadRequestException if the movie does not exist or the time is invalid.
   */
  async add(createShowtimeDto: CreateShowtimeDto): Promise<Showtime> {
    const { movieId, price, theater, startTime, endTime } = createShowtimeDto;

    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);

    if (startTimeDate > endTimeDate) {
      throw new BadRequestException(`Start time must be before end time.`);
    }

    // Check the movie exists.
    const movie = await this.moviesRepository.getById(movieId);
    if (!movie) {
      throw new BadRequestException(`Movie #${movieId} does not exist`);
    }

    const showtime = new Showtime();
    showtime.price = price;
    showtime.theater = theater;
    showtime.movie = movie;
    showtime.startTime = startTimeDate;
    showtime.endTime = endTimeDate;

    // addShowtime will validate the time. We only need to validate
    // that the time doesn't collide with other shows.
    return this.showtimesRepository.addShowtime(showtime);
  }

  /**
   * Updates an existing showtime by ID.
   *
   * Optionally updates any of the showtime's attributes.
   * Ensures that if a new movie ID is provided, the movie exists.
   *
   * @param showtimeId The ID of the showtime to update.
   * @param updatesDto DTO containing the updated fields.
   * @returns The updated showtime entity.
   * @throws BadRequestException if the new movie ID does not correspond to an existing movie.
   */
  async update(
    showtimeId: number,
    updatesDto: UpdateShowtimeDto,
  ): Promise<Showtime> {
    const { movieId, startTime, endTime } = updatesDto;
    const updates: Partial<Showtime> = {
      price: updatesDto.price,
      movie: updatesDto.movieId
        ? await this.moviesRepository.getById(movieId)
        : undefined,
      theater: updatesDto.theater,
      startTime: startTime ? new Date(startTime) : undefined,
      endTime: endTime ? new Date(endTime) : undefined,
    };

    // If the movieId is updated, and the movie doesn't exist (as we already
    // polled for it before), then fail.
    if (movieId && !updates.movie) {
      throw new BadRequestException(`Movie #${movieId} does not exist`);
    }

    return this.showtimesRepository.updateShowtime(showtimeId, updates);
  }

  /**
   * Deletes a showtime by its ID.
   *
   * @param showtimeId The ID of the showtime to delete.
   */
  async remove(showtimeId: number): Promise<void> {
    await this.showtimesRepository.deleteShowtime(showtimeId);
  }
}
