import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateBookingDto, ResponseBookingDto } from './bookings.dto';
import { BookingsService } from './bookings.service';

@Controller('/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @HttpCode(200)
  async addBooking(
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<ResponseBookingDto> {
    const booking = await this.bookingsService.bookSeat(createBookingDto);

    return new ResponseBookingDto(booking);
  }
}
