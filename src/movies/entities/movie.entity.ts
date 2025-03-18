import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CreateMovieDto } from '../movies.dto';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({})
  genre: string;

  @Column({ type: 'integer' })
  duration: number;

  @Column({ type: 'float' })
  rating: number;

  @Column({ type: 'integer' })
  releaseYear: number;

  constructor(createMovieDto?: CreateMovieDto) {
    if (createMovieDto) {
      this.title = createMovieDto.title;
      this.genre = createMovieDto.genre;
      this.duration = createMovieDto.duration;
      this.rating = createMovieDto.rating;
      this.releaseYear = createMovieDto.releaseYear;
    }
  }
}
