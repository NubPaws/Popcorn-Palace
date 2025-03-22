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

  /**
   * Checks if a specific seat is already booked for a given showtime.
   *
   * @param showtimeId - ID of the showtime.
   * @param seatNumber - Seat number to check.
   * @returns True if the seat is taken, false otherwise.
   */
  async isSeatTaken(showtimeId: number, seatNumber: number): Promise<boolean> {
    return this.repo.exists({
      where: { showtime: { id: showtimeId }, seatNumber },
      relations: ['showtime'],
    });
  }

  /**
   * Creates a new booking if the seat is available.
   *
   * @param booking - The booking entity to persist.
   * @returns The saved booking entity.
   * @throws ConflictException if the seat is already taken.
   */
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
