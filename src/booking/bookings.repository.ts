import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookingsRepository {
  constructor(
    @InjectRepository(Booking)
    private readonly repo: Repository<Booking>,
  ) {}

  async isSeatTaken(showtimeId: number, seatNumber: number): Promise<boolean> {
    return this.repo.exists({ where: { showtimeId, seatNumber } });
  }

  async createBooking(booking: Booking): Promise<Booking> {
    const { showtime, seatNumber } = booking;
    if (await this.isSeatTaken(showtime.id, seatNumber)) {
      throw new ConflictException(
        `Seat ${seatNumber} at ${showtime.theater} for ${showtime.movie.title} ` +
          `during ${showtime.startTime} to ${showtime.endTime} is already taken.` +
          `Try another seat or a different time.`,
      );
    }

    return this.repo.save(booking);
  }
}
