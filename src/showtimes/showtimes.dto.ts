export class CreateShowtimeDto {
  price: number;
  movieId: number;
  theater: string;
  startTime: string;
  endTime: string;
}

export type UpdateShowtimeDto = Partial<CreateShowtimeDto>;
