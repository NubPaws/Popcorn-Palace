import { Module } from '@nestjs/common';
import { Booking } from './entities/booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Booking])],
  controllers: [],
  providers: [],
})
export class BookingsModule {}
