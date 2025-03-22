import { BadRequestException, Injectable } from '@nestjs/common';
import { BookingsRepository } from './bookings.repository';
import { ShowtimesRepository } from '../showtimes/showtimes.repository';
import { CreateBookingDto } from './bookings.dto';
import { Booking } from './booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    private readonly bookingsRepository: BookingsRepository,
    private readonly showtimesRepository: ShowtimesRepository,
  ) {}

  async bookSeat(createBookingDto: CreateBookingDto): Promise<Booking> {
    const { seatNumber, showtimeId, userId } = createBookingDto;

    const booking = new Booking();
    booking.seatNumber = seatNumber;
    booking.userId = userId;
    booking.showtime = await this.showtimesRepository.getShowtime(showtimeId);

    if (!booking.showtime) {
      throw new BadRequestException(
        `Invalid showtime id ${showtimeId}. Make sure the showtime exists`,
      );
    }

    return this.bookingsRepository.createBooking(booking);
  }
}
