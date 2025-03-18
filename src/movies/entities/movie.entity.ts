import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
