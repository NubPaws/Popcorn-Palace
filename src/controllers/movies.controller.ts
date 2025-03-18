import { Controller, Get, Post, Body } from '@nestjs/common';
import { Movie } from '../entities/movie.entity';
import { MoviesService } from '../services/movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('all')
  async findAll(): Promise<Movie[]> {
    return this.moviesService.findAll();
  }

  @Post()
  async create(
    @Body('title') title: string,
    @Body('genre') genre: string,
    @Body('duration') duration: number,
    @Body('rating') rating: number,
    @Body('releaseYear') releaseYear: number,
  ) {
    return this.moviesService.create(
      title,
      genre,
      duration,
      rating,
      releaseYear,
    );
  }
}
