export class CreateShowtimeDto {
  price: number;
  movieId: number;
  theater: string;
  startTime: string;
  endTime: string;
}

export type UpdateShowtimeDto = Partial<CreateShowtimeDto>;

export class ResponseShowtimeDto {
  id: number;
  price: number;
  movieId: number;
  theater: string;
  startTime: string;
  endTime: string;
}
