import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { MoviesRepository } from './movies.repository';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: MoviesRepository,
  ) {}

  async findAll(): Promise<Movie[]> {
    return this.moviesRepository.find();
  }

  async create(movie: Movie): Promise<Movie> {
    return this.moviesRepository.saveMovie(movie);
  }

  async update(movieTitle: string, movieUpdates: Partial<Movie>) {
    return this.moviesRepository.updateMovie(movieTitle, movieUpdates);
  }

  async remove(movieTitle: string) {
    return this.moviesRepository.deleteMovie(movieTitle);
  }
}
