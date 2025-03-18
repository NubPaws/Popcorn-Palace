export class CreateMovieDto {
  title: string;
  genre: string;
  duration: number;
  rating: number;
  releaseYear: number;
}

export type UpdateMovieDto = Partial<CreateMovieDto>;
