import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  async create(
    title: string,
    genre: string,
    duration: number,
    rating: number,
    releaseYear: number,
  ): Promise<Movie> {
    const movie = this.moviesRepository.create({
      title,
      genre,
      duration,
      rating,
      releaseYear,
    });
    return this.moviesRepository.save(movie);
  }

  async findAll(): Promise<Movie[]> {
    return this.moviesRepository.find();
  }
}
