import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
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

  async getMovie(title?: string): Promise<Movie | null> {
    return this.repo.findOneBy({ title });
  }

  async movieExists(title?: string): Promise<boolean> {
    return (await this.repo.countBy({ title })) > 0;
  }

  async findAll(): Promise<Movie[]> {
    return this.repo.find();
  }

  async saveMovie(movie: Movie) {
    if (await this.movieExists(movie.title)) {
      throw new ConflictException(
        `Movie with title "${movie.title}" already exists in the database.`,
      );
    }

    return this.repo.save(movie);
  }

  async updateMovie(title: string, updates: Partial<Movie>) {
    const movie = await this.getMovie(title);
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
      (await this.movieExists(updates.title))
    ) {
      throw new ConflictException(
        `Movie with title "${updates.title}" already exists in the database.`,
      );
    }

    Object.assign(movie, updates);
    return this.repo.save(movie);
  }

  async deleteMovie(title: string) {
    const movie = await this.getMovie(title);

    if (!movie) {
      return;
    }

    return this.repo.delete({ title: title });
  }
}
