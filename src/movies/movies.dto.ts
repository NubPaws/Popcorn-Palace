import { Movie } from './movie.entity';

export class CreateMovieDto {
  title: string;
  genre: string;
  duration: number;
  rating: number;
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
