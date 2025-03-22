import { IsDateString } from 'class-validator';
import {
  IsNonNegative,
  IsPositiveInteger,
  IsValidString,
} from '../validation-utils';
import { Showtime } from './showtime.entity';

export class CreateShowtimeDto {
  @IsNonNegative('Showtime price')
  price: number;

  @IsPositiveInteger('Showtime movie ID')
  movieId: number;

  @IsValidString('Showtime theater')
  theater: string;

  @IsDateString(
    { strictSeparator: true, strict: true },
    { message: 'Showtime start time must be a datetime string.' },
  )
  startTime: string;

  @IsDateString(
    { strictSeparator: true, strict: true },
    { message: 'Showtime end time must be a datetime string.' },
  )
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
