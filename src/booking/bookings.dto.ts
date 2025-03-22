import { Booking } from './booking.entity';

export class CreateBookingDto {
  showtimeId: number;
  seatNumber: number;
  userId: string;
}

export class ResponseBookingDto {
  bookingId: string;

  constructor(booking: Booking) {
    this.bookingId = booking.id;
  }
}
