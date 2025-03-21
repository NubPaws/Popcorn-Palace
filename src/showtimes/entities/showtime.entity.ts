import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { CreateShowtimeDto } from '../showtimes.dto';

@Entity()
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  price: number;

  @ManyToOne(() => Movie, { eager: true })
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

  @Column()
  movieId: number;

  @Column({ type: 'text' })
  theater: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  constructor(createShowtimeDto?: CreateShowtimeDto) {
    if (createShowtimeDto) {
      this.price = createShowtimeDto.price;
      this.movieId = createShowtimeDto.movieId;
      this.theater = createShowtimeDto.theater;
      this.startTime = new Date(createShowtimeDto.startTime);
      this.endTime = new Date(createShowtimeDto.endTime);
    }
  }
}
