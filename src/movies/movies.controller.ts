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

  /**
   * Retrieves all movies from the database.
   *
   * @returns An array of movies wrapped in response DTOs.
   */
  @Get('all')
  @HttpCode(200)
  async findAll(): Promise<ResponseMovieDto[]> {
    const movies = await this.moviesService.findAll();
    return movies.map((movie) => new ResponseMovieDto(movie));
  }

  /**
   * Creates a new movie.
   *
   * @param createMovieDto - DTO containing movie creation data.
   * @returns The created movie wrapped in a response DTO.
   */
  @Post()
  @HttpCode(200)
  async create(
    @Body() createMovieDto: CreateMovieDto,
  ): Promise<ResponseMovieDto> {
    const movie = await this.moviesService.create(createMovieDto);
    return new ResponseMovieDto(movie);
  }

  /**
   * Updates an existing movie by its title.
   *
   * @param movieTitle - The title of the movie to update.
   * @param movieUpdate - DTO containing fields to update.
   * @returns The updated movie wrapped in a response DTO.
   */
  @Post('update/:movieTitle')
  @HttpCode(200)
  async update(
    @Param('movieTitle') movieTitle: string,
    @Body() movieUpdate: UpdateMovieDto,
  ): Promise<ResponseMovieDto> {
    const movie = await this.moviesService.update(movieTitle, movieUpdate);
    return new ResponseMovieDto(movie);
  }

  /**
   * Deletes a movie by its title.
   *
   * @param movieTitle - The title of the movie to delete.
   */
  @Delete(':movieTitle')
  @HttpCode(200)
  async remove(@Param('movieTitle') movieTitle: string): Promise<void> {
    await this.moviesService.remove(movieTitle);
  }
}
