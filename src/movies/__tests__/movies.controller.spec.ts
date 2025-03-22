import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from '../movies.controller';
import { MoviesService } from '../movies.service';
import { Movie } from '../entities/movie.entity';
import { CreateMovieDto, UpdateMovieDto } from '../movies.dto';

describe('MoviesController', () => {
  let controller: MoviesController;

  const mockMoviesService = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [{ provide: MoviesService, useValue: mockMoviesService }],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of movies in response DTO format', async () => {
      const movie = new Movie();
      movie.id = 1;
      movie.title = 'Test Movie';
      movie.genre = 'Action';
      movie.duration = 120;
      movie.rating = 4.5;
      movie.releaseYear = 2021;

      mockMoviesService.findAll.mockResolvedValue([movie]);

      const result = await controller.findAll();
      expect(result).toEqual([
        {
          id: movie.id,
          title: movie.title,
          genre: movie.genre,
          duration: movie.duration,
          rating: movie.rating,
          releaseYear: movie.releaseYear,
        },
      ]);
    });
  });

  describe('create', () => {
    it('should create and return a movie response DTO', async () => {
      const createDto: CreateMovieDto = {
        title: 'New Movie',
        genre: 'Comedy',
        duration: 90,
        rating: 4,
        releaseYear: 2022,
      };

      const movie = Object.assign(new Movie(), createDto);
      movie.id = 1;
      mockMoviesService.create.mockResolvedValue(movie);

      const result = await controller.create(createDto);
      expect(result).toEqual({
        id: movie.id,
        title: movie.title,
        genre: movie.genre,
        duration: movie.duration,
        rating: movie.rating,
        releaseYear: movie.releaseYear,
      });
    });
  });

  describe('update', () => {
    it('should update and return a movie response DTO', async () => {
      const updateDto: UpdateMovieDto = { title: 'Updated Title' };
      const movie = new Movie();
      movie.id = 1;
      movie.title = 'Updated Title';
      movie.genre = 'Action';
      movie.duration = 120;
      movie.rating = 4.5;
      movie.releaseYear = 2021;

      mockMoviesService.update.mockResolvedValue(movie);

      const result = await controller.update('Test Movie', updateDto);
      expect(result).toEqual({
        id: movie.id,
        title: movie.title,
        genre: movie.genre,
        duration: movie.duration,
        rating: movie.rating,
        releaseYear: movie.releaseYear,
      });
    });
  });

  describe('remove', () => {
    it('should call remove on the service', async () => {
      mockMoviesService.remove.mockResolvedValue(undefined);

      await controller.remove('Test Movie');
      expect(mockMoviesService.remove).toHaveBeenCalledWith('Test Movie');
    });
  });
});
