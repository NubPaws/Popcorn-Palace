import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { ShowtimesModule } from '../showtimes/showtimes.module';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { BookingsRepository } from './bookings.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), ShowtimesModule],
  controllers: [BookingsController],
  providers: [BookingsService, BookingsRepository],
})
export class BookingsModule {}
