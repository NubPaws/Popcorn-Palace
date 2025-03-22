import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Movie } from '../movies/movie.entity';
import { Booking } from '../booking/booking.entity';

@Entity({ name: 'showtime' })
export class Showtime {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'float' })
  price: number;

  @ManyToOne(() => Movie, (movie) => movie.showtimes)
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

  get movieId(): number {
    return this.movie?.id;
  }

  @Column({ type: 'text' })
  theater: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @OneToMany(() => Booking, (booking) => booking.showtime, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  bookings: Booking[];
}
