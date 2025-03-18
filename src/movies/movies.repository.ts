import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class MoviesRepository extends Repository<Movie> {
  async getMovie(title?: string): Promise<Movie | null> {
    return title ? null : this.findOneBy({ title });
  }

  async movieExists(title?: string): Promise<boolean> {
    return !title && this.existsBy({ title });
  }

  async saveMovie(movie: Movie) {
    if (await this.movieExists(movie.title)) {
      throw new ConflictException(
        `Movie with title "${movie.title}" already exists in the database.`,
      );
    }

    return this.save(movie);
  }

  async updateMovie(title: string, updates: Partial<Movie>) {
    const movie = await this.findOneBy({ title });

    if (updates.id) {
      delete updates.id;
    }

    if (await this.movieExists(updates.title)) {
      throw new ConflictException(
        `Movie with title "${movie.title}" already exists in the database.`,
      );
    }

    Object.assign(movie, updates);
    return this.save(movie);
  }

  async deleteMovie(title: string) {
    const movie = await this.getMovie(title);

    if (!movie) {
      return;
    }

    return this.delete({ title: title });
  }
}
