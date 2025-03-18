import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';

describe('MoviesController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<Movie>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    repository = moduleFixture.get<Repository<Movie>>(
      getRepositoryToken(Movie),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /movies - should create a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/movies')
      .send({
        title: 'Sample Movie 1',
        genre: 'Action',
        duration: 120,
        rating: 9.8,
        releaseYear: 2025,
      })
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      title: 'Sample Movie 1',
      genre: 'Action',
      duration: 120,
      rating: 9.8,
      releaseYear: 2025,
    });
  });

  it('GET /movies - should return all movies', async () => {
    const response = await request(app.getHttpServer())
      .get('/movies/all')
      .expect(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
