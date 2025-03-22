import { IsInt } from 'class-validator';
import { Movie } from './movie.entity';
import {
  IsInRange,
  IsPositiveInteger,
  IsValidString,
} from '../utilities/validation-utils';

export class CreateMovieDto {
  @IsValidString('Movie title')
  title: string;

  @IsValidString('Movie genre')
  genre: string;

  @IsPositiveInteger('Movie duration')
  duration: number;

  @IsInRange('Movie rating', 0, 10)
  rating: number;

  @IsInt({ message: 'Movie release year must be a whole number.' })
  releaseYear: number;
}

export type UpdateMovieDto = Partial<CreateMovieDto>;

export class ResponseMovieDto {
  id: number;
  title: string;
  genre: string;
  duration: number;
  rating: number;
  releaseYear: number;

  constructor(movie: Movie) {
    this.id = movie.id;
    this.title = movie.title;
    this.genre = movie.genre;
    this.duration = movie.duration;
    this.rating = movie.rating;
    this.releaseYear = movie.releaseYear;
  }
}
