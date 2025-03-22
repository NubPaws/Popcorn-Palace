import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppTestModule } from './app-test.module';

describe('Movies API (e2e)', () => {
  let app: INestApplication;

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

  it('/movies (POST) - Create a movie', async () => {
    const createMovieDto = {
      title: 'Inception',
      genre: 'Sci-Fi',
      duration: 148,
      rating: 8.8,
      releaseYear: 2010,
    };

    const response = await request(app.getHttpServer())
      .post('/movies')
      .send(createMovieDto)
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toEqual(createMovieDto.title);
  });

  it('/movies/all (GET) - Retrieve all movies', async () => {
    const response = await request(app.getHttpServer())
      .get('/movies/all')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/movies/update/:movieTitle (POST) - Update a movie', async () => {
    const updateMovieDto = {
      genre: 'Thriller',
      rating: 9.0,
    };

    const response = await request(app.getHttpServer())
      .post('/movies/update/Inception')
      .send(updateMovieDto)
      .expect(200);

    expect(response.body.genre).toEqual(updateMovieDto.genre);
    expect(response.body.rating).toEqual(updateMovieDto.rating);
  });

  it('/movies/:movieTitle (DELETE) - Remove a movie', async () => {
    await request(app.getHttpServer()).delete('/movies/Inception').expect(200);

    const response = await request(app.getHttpServer())
      .get('/movies/all')
      .expect(200);

    const movies = response.body;
    const movie = movies.find((m) => m.title === 'Inception');
    expect(movie).toBeUndefined();
  });
});
