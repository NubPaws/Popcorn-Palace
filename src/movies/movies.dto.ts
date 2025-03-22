import { IsInt, IsPositive } from 'class-validator';
import { Movie } from './movie.entity';
import { IsInRange, IsValidString } from '../validation-utils';

export class CreateMovieDto {
  @IsValidString('Movie title')
  title: string;

  @IsValidString('Movie genre')
  genre: string;

  @IsInt({ message: 'Movie duration must be a whole number.' })
  @IsPositive({ message: 'Movie duration must be a positive number.' })
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
