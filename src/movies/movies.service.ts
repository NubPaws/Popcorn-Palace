import { Injectable } from '@nestjs/common';
import { Movie } from './movie.entity';
import { MoviesRepository } from './movies.repository';
import { CreateMovieDto, UpdateMovieDto } from './movies.dto';

@Injectable()
export class MoviesService {
  constructor(private readonly moviesRepository: MoviesRepository) {}

  /**
   * Fetches all movies.
   *
   * @returns An array of all movie entities.
   */
  async findAll(): Promise<Movie[]> {
    return this.moviesRepository.findAll();
  }

  /**
   * Creates and saves a new movie.
   *
   * @param createMovieDto - DTO containing movie details.
   * @returns The created movie entity.
   */
  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = Object.assign(new Movie(), createMovieDto);
    return this.moviesRepository.saveMovie(movie);
  }

  /**
   * Updates a movie based on its title.
   *
   * @param movieTitle - The title of the movie to update.
   * @param updateMovieDto - DTO containing updated fields.
   * @returns The updated movie entity.
   */
  async update(
    movieTitle: string,
    updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    return this.moviesRepository.updateMovie(movieTitle, updateMovieDto);
  }

  /**
   * Deletes a movie by its title.
   *
   * @param movieTitle - The title of the movie to delete.
   */
  async remove(movieTitle: string): Promise<void> {
    await this.moviesRepository.deleteMovie(movieTitle);
  }
}
