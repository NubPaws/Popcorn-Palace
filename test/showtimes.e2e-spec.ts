import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Movie } from '../src/movies/entities/movie.entity';
import { CreateMovieDto } from '../src/movies/movies.dto';
import { Showtime } from '../src/showtimes/entities/showtime.entity';
import { CreateShowtimeDto } from '../src/showtimes/showtimes.dto';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';

describe('Showtimes API (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  let movie: Movie;
  let showtime: Showtime;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get<DataSource>(getDataSourceToken());
    // Clear the relevant database that we affected.
    await dataSource.getRepository(Movie).delete({});
    await dataSource.getRepository(Showtime).delete({});

    // Create a movie and a showtime so that we can use them later.
    const createMovieDto: CreateMovieDto = {
      title: `Movie 1`,
      genre: 'Action',
      duration: 120,
      rating: 9.2,
      releaseYear: 2025,
    };

    const movieRes = await request(app.getHttpServer())
      .post('/movies')
      .send(createMovieDto)
      .expect(200);

    movie = movieRes.body;

    const createShowtimeDto: CreateShowtimeDto = {
      theater: 'Theater 0',
      movieId: movie.id,
      price: 99.99,
      startTime: '2025-03-21T14:00:00.000Z',
      endTime: '2025-03-21T16:00:00.000Z',
    };

    const showtimeRes = await request(app.getHttpServer())
      .post('/showtimes')
      .send(createShowtimeDto)
      .expect(200);
    showtime = showtimeRes.body;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should successfully return a showtime', async () => {
    const response = await request(app.getHttpServer())
      .get(`/showtimes/${showtime.id}`)
      .expect(200);

    expect(response.body).toMatchObject(showtime);
  });
});
