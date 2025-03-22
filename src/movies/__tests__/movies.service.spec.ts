import { Test, TestingModule } from '@nestjs/testing';
import { MoviesRepository } from '../movies.repository';
import { MoviesService } from '../movies.service';
import { Movie } from '../movie.entity';

describe('MoviesService', () => {
  let service: MoviesService;

  const mockMoviesRepository = {
    getByTitle: jest.fn(),
    existsByTitle: jest.fn(),
    findAll: jest.fn(),
    saveMovie: jest.fn(),
    updateMovie: jest.fn(),
    deleteMovie: jest.fn(),
    getById: jest.fn(),
    existsById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: MoviesRepository, useValue: mockMoviesRepository },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const moviesArray = [new Movie(), new Movie()];
      mockMoviesRepository.findAll.mockResolvedValue(moviesArray);

      const result = await service.findAll();
      expect(result).toEqual(moviesArray);
    });
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      const createDto = {
        title: 'New Movie',
        genre: 'Action',
        duration: 120,
        rating: 4.5,
        releaseYear: 2021,
      };
      const movie = Object.assign(new Movie(), createDto);
      mockMoviesRepository.saveMovie.mockResolvedValue(movie);

      const result = await service.create(createDto);
      expect(result).toEqual(movie);
      expect(mockMoviesRepository.saveMovie).toHaveBeenCalledWith(
        expect.objectContaining(createDto),
      );
    });
  });

  describe('update', () => {
    it('should update a movie', async () => {
      const updateDto = { title: 'Updated Title' };
      const movie = new Movie();
      movie.id = 1;
      movie.title = 'Original Title';

      mockMoviesRepository.getByTitle = jest.fn().mockResolvedValue(movie);
      mockMoviesRepository.existsByTitle = jest.fn().mockResolvedValue(false);

      const updatedMovie = { ...movie, title: 'Updated Title' };
      mockMoviesRepository.updateMovie.mockResolvedValue(updatedMovie);

      const result = await service.update('Original Title', updateDto);
      expect(result.title).toEqual('Updated Title');
    });
  });

  describe('remove', () => {
    it('should remove a movie', async () => {
      mockMoviesRepository.deleteMovie.mockResolvedValue(undefined);
      await service.remove('Some Title');
      expect(mockMoviesRepository.deleteMovie).toHaveBeenCalledWith(
        'Some Title',
      );
    });
  });
});
