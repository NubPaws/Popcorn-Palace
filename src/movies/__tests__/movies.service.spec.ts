import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from '../movies.service';
import { MoviesRepository } from '../movies.repository';
import { Movie } from '../entities/movie.entity';

describe('MoviesService', () => {
  let moviesService: MoviesService;

  const mockMovie = new Movie({
    title: 'Test Movie',
    genre: 'Drama',
    duration: 120,
    rating: 8.5,
    releaseYear: 2020,
  });

  const moviesRepositoryMock = {
    findAll: jest.fn(),
    saveMovie: jest.fn(),
    updateMovie: jest.fn(),
    deleteMovie: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: MoviesRepository,
          useValue: moviesRepositoryMock,
        },
      ],
    }).compile();

    moviesService = module.get<MoviesService>(MoviesService);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      moviesRepositoryMock.findAll.mockResolvedValue([mockMovie]);
      const movies = await moviesService.findAll();

      expect(movies).toEqual([mockMovie]);
      expect(moviesRepositoryMock.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a movie', async () => {
      moviesRepositoryMock.saveMovie.mockResolvedValue(mockMovie);
      const movie = await moviesService.create(mockMovie);

      expect(movie).toEqual(mockMovie);
      expect(moviesRepositoryMock.saveMovie).toHaveBeenCalledWith(mockMovie);
    });

    it('should fail creating the movie again', async () => {
      moviesRepositoryMock.saveMovie.mockRejectedValue(
        new Error('Movie already exists'),
      );

      await expect(moviesService.create(mockMovie)).rejects.toThrow(
        'Movie already exists',
      );
      expect(moviesRepositoryMock.saveMovie).toHaveBeenCalledWith(mockMovie);
    });
  });

  describe('update', () => {
    it('should change the movies title', async () => {
      moviesRepositoryMock.updateMovie.mockResolvedValue({
        ...mockMovie,
        genre: 'Action',
      });

      const updateMovieDto: Partial<Movie> = { genre: 'Action' };
      const movie = await moviesService.update('Test Movie', updateMovieDto);

      expect(movie.genre).toEqual('Action');
      expect(moviesRepositoryMock.updateMovie).toHaveBeenCalledWith(
        'Test Movie',
        updateMovieDto,
      );
    });
  });

  describe('deleteMovie', () => {
    it('should remove a movie', async () => {
      moviesRepositoryMock.deleteMovie.mockResolvedValue({ affected: 1 });
      await moviesService.remove('Test Movie');
      expect(moviesRepositoryMock.deleteMovie).toHaveBeenCalledWith(
        'Test Movie',
      );
    });
  });
});
