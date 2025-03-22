import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Showtime } from '../showtimes/showtime.entity';

@Entity('booking')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('integer')
  seatNumber: number;

  @ManyToOne(() => Showtime, (showtime) => showtime.bookings)
  @JoinColumn({ name: 'showtimeId' })
  showtime: Showtime;

  get showtimeId(): number {
    return this.showtime?.id;
  }
}
