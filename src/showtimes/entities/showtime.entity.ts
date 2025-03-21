import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { Booking } from '../../booking/entities/booking.entity';

@Entity()
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  price: number;

  @ManyToOne(() => Movie, (movie) => movie.showtimes)
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

  @Column({ type: 'text' })
  theater: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @OneToMany(() => Booking, (booking) => booking.showtime, {
    onDelete: 'CASCADE',
  })
  bookings: Booking[];
}
