import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Showtime } from '../../showtimes/entities/showtime.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  bookingId: string;

  @Column('integer')
  seatNumber: number;

  @ManyToOne(() => Showtime, (showtime) => showtime.bookings)
  showtime: Showtime;
}
