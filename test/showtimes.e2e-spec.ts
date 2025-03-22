import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppTestModule } from './app-test.module';

const hrsToMs = (hrs: number) => hrs * 60 * 60 * 1000;

describe('Showtimes API (e2e)', () => {
  let app: INestApplication;
  let movieId: number;
  let showtimeId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppTestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const createMovieDto = {
      title: 'Interstellar',
      genre: 'Sci-Fi',
      duration: 169,
      rating: 8.6,
      releaseYear: 2014,
    };

    const movieResponse = await request(app.getHttpServer())
      .post('/movies')
      .send(createMovieDto)
      .expect(200);

    movieId = movieResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/showtimes (POST) - Add a showtime', async () => {
    const now = Date.now();
    const createShowtimeDto = {
      movieId: movieId,
      price: 12.5,
      theater: 'Theater 1',
      startTime: new Date(now + hrsToMs(1)).toISOString(),
      endTime: new Date(now + hrsToMs(2)).toISOString(),
    };

    const response = await request(app.getHttpServer())
      .post('/showtimes')
      .send(createShowtimeDto)
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.movieId).toEqual(movieId);
    showtimeId = response.body.id;
  });

  it('/showtimes/:showtimeId (GET) - Retrieve a showtime', async () => {
    const response = await request(app.getHttpServer())
      .get(`/showtimes/${showtimeId}`)
      .expect(200);

    expect(response.body.id).toEqual(showtimeId);
    expect(response.body.movieId).toEqual(movieId);
  });

  it('/showtimes/update/:showtimeId (POST) - Update a showtime', async () => {
    const updateShowtimeDto = {
      price: 15.0,
    };

    const response = await request(app.getHttpServer())
      .post(`/showtimes/update/${showtimeId}`)
      .send(updateShowtimeDto)
      .expect(200);

    expect(response.body.price).toEqual(updateShowtimeDto.price);
  });

  it('/showtimes/:showtimeId (DELETE) - Remove a showtime', async () => {
    await request(app.getHttpServer())
      .delete(`/showtimes/${showtimeId}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/showtimes/${showtimeId}`)
      .expect(404);
  });
});
