import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MoviesRepository {
  constructor(
    @InjectRepository(Movie)
    private readonly repo: Repository<Movie>,
  ) {}

  /**
   * Fetches a movie by title.
   *
   * @param title - Title of the movie.
   * @returns The movie if found, otherwise null.
   */
  async getByTitle(title?: string): Promise<Movie | null> {
    return this.repo.findOneBy({ title });
  }

  /**
   * Fetches a movie by ID.
   *
   * @param id - ID of the movie.
   * @returns The movie if found, otherwise null.
   */
  async getById(id?: number): Promise<Movie | null> {
    return this.repo.findOneBy({ id });
  }

  /**
   * Checks if a movie with the given title exists.
   *
   * @param title - Movie title to check.
   * @returns True if exists, false otherwise.
   */
  async existsByTitle(title?: string): Promise<boolean> {
    return (await this.repo.countBy({ title })) > 0;
  }

  /**
   * Checks if a movie with the given ID exists.
   *
   * @param id - Movie ID to check.
   * @returns True if exists, false otherwise.
   */
  async existsById(id: number): Promise<boolean> {
    return (await this.repo.countBy({ id })) > 0;
  }

  /**
   * Retrieves all movies.
   *
   * @returns An array of all movie entities.
   */
  async findAll(): Promise<Movie[]> {
    return this.repo.find();
  }

  /**
   * Saves a new movie to the database, checking for duplicates.
   *
   * @param movie - The movie entity to save.
   * @returns The saved movie entity.
   * @throws ConflictException if a movie with the same title already exists.
   */
  async saveMovie(movie: Movie): Promise<Movie> {
    if (await this.existsByTitle(movie.title)) {
      throw new ConflictException(
        `Movie with title "${movie.title}" already exists in the database.`,
      );
    }

    return this.repo.save(movie);
  }

  /**
   * Updates an existing movie by title.
   *
   * @param title - The title of the movie to update.
   * @param updates - Partial fields to update.
   * @returns The updated movie entity.
   * @throws NotFoundException if the movie does not exist.
   * @throws ConflictException if the new title conflicts with an existing movie.
   */
  async updateMovie(title: string, updates: Partial<Movie>): Promise<Movie> {
    const movie = await this.getByTitle(title);
    if (!movie) {
      throw new NotFoundException(
        `Movie titled "${title}" does not exist in the database.`,
      );
    }

    if (updates.id) {
      delete updates.id;
    }

    if (
      updates.title &&
      updates.title !== title &&
      (await this.existsByTitle(updates.title))
    ) {
      throw new ConflictException(
        `Movie with title "${updates.title}" already exists in the database.`,
      );
    }

    Object.assign(movie, updates);
    return this.repo.save(movie);
  }

  /**
   * Deletes a movie by its title if it exists.
   *
   * @param title - The title of the movie to delete.
   */
  async deleteMovie(title: string) {
    const movie = await this.getByTitle(title);

    if (!movie) {
      return;
    }

    this.repo.delete({ title: title });
  }
}
