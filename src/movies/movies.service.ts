import { Injectable } from '@nestjs/common';
import { Movie } from './movie.entity';
import { MoviesRepository } from './movies.repository';
import { CreateMovieDto, UpdateMovieDto } from './movies.dto';

@Injectable()
export class MoviesService {
  constructor(private readonly moviesRepository: MoviesRepository) {}

  async findAll(): Promise<Movie[]> {
    return this.moviesRepository.findAll();
  }

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = Object.assign(new Movie(), createMovieDto);
    return this.moviesRepository.saveMovie(movie);
  }

  async update(
    movieTitle: string,
    updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    return this.moviesRepository.updateMovie(movieTitle, updateMovieDto);
  }

  async remove(movieTitle: string): Promise<void> {
    await this.moviesRepository.deleteMovie(movieTitle);
  }
}
