import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto, ResponseMovieDto, UpdateMovieDto } from './movies.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('all')
  @HttpCode(200)
  async findAll(): Promise<ResponseMovieDto[]> {
    const movies = await this.moviesService.findAll();
    return movies.map((movie) => new ResponseMovieDto(movie));
  }

  @Post()
  @HttpCode(200)
  async create(
    @Body() createMovieDto: CreateMovieDto,
  ): Promise<ResponseMovieDto> {
    const movie = await this.moviesService.create(createMovieDto);
    return new ResponseMovieDto(movie);
  }

  @Post('update/:movieTitle')
  @HttpCode(200)
  async update(
    @Param('movieTitle') movieTitle: string,
    @Body() movieUpdate: UpdateMovieDto,
  ): Promise<ResponseMovieDto> {
    const movie = await this.moviesService.update(movieTitle, movieUpdate);
    return new ResponseMovieDto(movie);
  }

  @Delete(':movieTitle')
  @HttpCode(200)
  async remove(@Param('movieTitle') movieTitle: string): Promise<void> {
    await this.moviesService.remove(movieTitle);
  }
}
