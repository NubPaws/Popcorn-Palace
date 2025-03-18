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
import { CreateMovieDto, UpdateMovieDto } from './movies.dto';

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
    return this.moviesService.create(new Movie(createMovieDto));
  }

  @Post('update/:movieTitle')
  @HttpCode(200)
  async update(
    @Param('movieTitle') movieTitle: string,
    @Body() movieUpdate: UpdateMovieDto,
  ) {
    return this.moviesService.update(movieTitle, movieUpdate);
  }

  @Delete(':movieTitle')
  @HttpCode(200)
  async remove(@Param('movieTitle') movieTitle: string) {
    return this.moviesService.remove(movieTitle);
  }
}
