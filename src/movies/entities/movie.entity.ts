import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Showtime } from '../../showtimes/entities/showtime.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', unique: true })
  title: string;

  @Column('text')
  genre: string;

  @Column('integer')
  duration: number;

  @Column('float')
  rating: number;

  @Column('integer')
  releaseYear: number;

  @OneToMany(() => Showtime, (showtime) => showtime.movie, {
    onDelete: 'CASCADE',
  })
  showtimes: Showtime[];
}
