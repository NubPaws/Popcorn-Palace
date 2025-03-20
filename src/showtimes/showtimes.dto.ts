import { CreateMovieDto } from '../movies/movies.dto';

export class CreateShowtimeDto {
  price: number;
  movieId: number;
  theater: string;
  startTime: string;
  endTime: string;
}

export type UpdateShowtimeDto = Partial<CreateMovieDto>;
