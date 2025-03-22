import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateBookingDto, ResponseBookingDto } from './bookings.dto';
import { BookingsService } from './bookings.service';

@Controller('/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * Creates a new seat booking for a given showtime.
   *
   * @param createBookingDto - DTO containing booking details (seat, showtime, user).
   * @returns The created booking wrapped in a response DTO.
   */
  @Post()
  @HttpCode(200)
  async addBooking(
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<ResponseBookingDto> {
    const booking = await this.bookingsService.bookSeat(createBookingDto);

    return new ResponseBookingDto(booking);
  }
}
