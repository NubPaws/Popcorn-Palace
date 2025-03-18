import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { Movie } from './entities/movie.entity';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('all')
  @HttpCode(200)
  async findAll(): Promise<Movie[]> {
    return this.moviesService.findAll();
  }

  @Post()
  @HttpCode(200)
  async create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    const { title, genre, duration, rating, releaseYear } = createMovieDto;

    return this.moviesService.create(
      title,
      genre,
      duration,
      rating,
      releaseYear,
    );
  }

  @Post('update/:movieTitle')
  @HttpCode(200)
  async update(@Param('movieTitle') movieTitle: string) {
    return { movieTitle };
  }

  @Delete(':movieTitle')
  @HttpCode(200)
  async remove(@Param('movieTitle') movieTitle: string) {
    return { movieTitle };
  }
}
