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

  @ManyToOne(() => Movie)
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

  @Column({ type: 'text' })
  theater: string;

  @Column({ type: 'datetime' })
  startTime: Date;

  @Column({ type: 'datetime' })
  endTime: Date;

  constructor(createShowtimeDto?: CreateShowtimeDto) {
    if (createShowtimeDto) {
      this.price = createShowtimeDto.price;
      this.movie = { id: createShowtimeDto.movieId } as Movie;
      this.theater = createShowtimeDto.theater;
      this.startTime = new Date(createShowtimeDto.startTime);
      this.endTime = new Date(createShowtimeDto.endTime);
    }
  }
}
