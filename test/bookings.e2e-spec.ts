import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppTestModule } from './app-test.module';
import * as request from 'supertest';
import { CreateBookingDto } from '../src/booking/bookings.dto';
import { CreateMovieDto } from '../src/movies/movies.dto';
import { CreateShowtimeDto } from '../src/showtimes/showtimes.dto';

const hrsToMs = (hrs: number) => hrs * 60 * 60 * 1000;

describe('Bookings (e2e)', () => {
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
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a movie, showtime and booking', async () => {
    const createMovieDto: CreateMovieDto = {
      title: 'Sample Movie Title',
      genre: 'Action',
      duration: 120,
      rating: 8.7,
      releaseYear: 2025,
    };
    const movieResponse = await request(app.getHttpServer())
      .post('/movies')
      .send(createMovieDto)
      .expect(200);

    movieId = movieResponse.body.id;
    expect(movieResponse.body).toHaveProperty('id');

    const now = new Date();
    const createShowtimeDto: CreateShowtimeDto = {
      movieId,
      price: 20.2,
      theater: 'Sample Theater',
      startTime: new Date(now.getTime() + hrsToMs(1)).toISOString(),
      endTime: new Date(now.getTime() + hrsToMs(2)).toISOString(),
    };
    const showtimeResponse = await request(app.getHttpServer())
      .post('/showtimes')
      .send(createShowtimeDto)
      .expect(200);

    showtimeId = showtimeResponse.body.id;
    expect(showtimeResponse.body).toHaveProperty('id');

    const createBookingDto: CreateBookingDto = {
      userId: '84438967-f68f-4fa0-b620-0f08217e76af',
      showtimeId,
      seatNumber: 15,
    };
    const bookingResponse = await request(app.getHttpServer())
      .post('/bookings')
      .send(createBookingDto)
      .expect(200);

    expect(bookingResponse.body).toHaveProperty('bookingId');
  });
});
