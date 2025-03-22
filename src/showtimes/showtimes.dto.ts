import { Showtime } from './entities/showtime.entity';

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

  constructor(showtime: Showtime) {
    this.id = showtime.id;
    this.price = showtime.price;
    this.movieId = showtime.movieId;
    this.theater = showtime.theater;
    this.startTime = showtime.startTime.toISOString();
    this.endTime = showtime.endTime.toISOString();
  }
}
