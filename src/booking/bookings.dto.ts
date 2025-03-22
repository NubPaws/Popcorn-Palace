import { IsUUID } from 'class-validator';
import { IsPositiveInteger } from '../validation-utils';
import { Booking } from './booking.entity';

export class CreateBookingDto {
  @IsPositiveInteger('Booking showtime ID')
  showtimeId: number;

  @IsPositiveInteger('Booking seat number')
  seatNumber: number;

  @IsUUID('all', { message: 'Booking user ID must be a valid UUID.' })
  userId: string;
}

export class ResponseBookingDto {
  bookingId: string;

  constructor(booking: Booking) {
    this.bookingId = booking.id;
  }
}
