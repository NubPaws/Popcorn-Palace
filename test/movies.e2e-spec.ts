import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const testMovie = {
  title: 'Sample Movie Title 1',
  genre: 'Action',
  duration: 120,
  rating: 8.7,
  releaseYear: 2025,
};

describe('Movies API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a movie', async () => {
    const res = await request(app.getHttpServer())
      .post('/movies')
      .send(testMovie)
      .expect(200);

    expect(res.body).toMatchObject(testMovie);
  });

  it('should fail creating a movie', async () => {
    console.log('Create testMovie first');
    await request(app.getHttpServer()).post('/movies').send(testMovie);

    console.log('Create it again');
    await request(app.getHttpServer())
      .post('/movies')
      .send(testMovie)
      .expect(409);
  });

  it('should get all movies', async () => {
    const res = await request(app.getHttpServer())
      .get('/movies/all')
      .expect(200);

    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.some((m) => m.title === testMovie.title)).toBeTruthy();
  });

  it('should update a movie', async () => {
    console.log('Create the testMovie first.');
    await request(app.getHttpServer()).post('/movies').send(testMovie);

    console.log('Try and update it with a different year.');
    const updateData = { year: 2011 };
    const res = await request(app.getHttpServer())
      .post(`/movies/update/${testMovie.title}`)
      .send(updateData)
      .expect(200);

    expect(res.body.year).toBe(2011);
  });

  it('should delete a movie', async () => {
    await request(app.getHttpServer())
      .delete(`/movies/${testMovie.title}`)
      .expect(200);
  });
});
