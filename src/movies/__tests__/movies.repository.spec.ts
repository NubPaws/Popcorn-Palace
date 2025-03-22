import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MoviesRepository } from '../movies.repository';
import { Movie } from '../entities/movie.entity';

describe('MoviesRepository', () => {
  let moviesRepository: MoviesRepository;

  // A sample movie for testing
  const mockMovie: Movie = new Movie({
    title: 'Test Movie',
    genre: 'Drama',
    duration: 120,
    rating: 8.5,
    releaseYear: 2020,
  });

  // Create a simple mock for the TypeORM Repository
  const repositoryMock = {
    findOneBy: jest.fn(),
    countBy: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesRepository,
        {
          provide: getRepositoryToken(Movie),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    moviesRepository = module.get<MoviesRepository>(MoviesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMovie', () => {
    it('should return a movie if found', async () => {
      repositoryMock.findOneBy.mockResolvedValue(mockMovie);
      const movie = await moviesRepository.getByTitle('Test Movie');
      expect(movie).toEqual(mockMovie);
      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({
        title: 'Test Movie',
      });
    });

    it('should return null if movie is not found', async () => {
      repositoryMock.findOneBy.mockResolvedValue(null);
      const movie = await moviesRepository.getByTitle('Nonexistent');
      expect(movie).toBeNull();
    });
  });

  describe('movieExists', () => {
    it('should return true if movie exists', async () => {
      repositoryMock.countBy.mockResolvedValue(1);
      const exists = await moviesRepository.existsByTitle('Test Movie');
      expect(exists).toBe(true);
    });

    it('should return false if movie does not exist', async () => {
      repositoryMock.countBy.mockResolvedValue(0);
      const exists = await moviesRepository.existsByTitle('Nonexistent');
      expect(exists).toBe(false);
    });
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      repositoryMock.find.mockResolvedValue([mockMovie]);
      const movies = await moviesRepository.findAll();
      expect(movies).toEqual([mockMovie]);
      expect(repositoryMock.find).toHaveBeenCalled();
    });
  });

  describe('saveMovie', () => {
    it('should save a new movie when it does not exist', async () => {
      repositoryMock.countBy.mockResolvedValue(0);
      repositoryMock.save.mockResolvedValue(mockMovie);
      const movie = await moviesRepository.saveMovie(mockMovie);
      expect(movie).toEqual(mockMovie);
      expect(repositoryMock.save).toHaveBeenCalledWith(mockMovie);
    });

    it('should throw ConflictException if movie already exists', async () => {
      repositoryMock.countBy.mockResolvedValue(1);
      await expect(moviesRepository.saveMovie(mockMovie)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('updateMovie', () => {
    it('should update a movie if it exists', async () => {
      repositoryMock.findOneBy.mockResolvedValue(mockMovie);
      // New title not causing a conflict:
      repositoryMock.countBy.mockResolvedValue(0);
      repositoryMock.save.mockResolvedValue({ ...mockMovie, genre: 'Comedy' });

      const updated = await moviesRepository.updateMovie('Test Movie', {
        genre: 'Comedy',
      });
      expect(updated.genre).toEqual('Comedy');
      expect(repositoryMock.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if movie does not exist', async () => {
      repositoryMock.findOneBy.mockResolvedValue(null);
      await expect(
        moviesRepository.updateMovie('Nonexistent', { genre: 'Comedy' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if new title already exists', async () => {
      repositoryMock.findOneBy.mockResolvedValue(mockMovie);
      // Simulate that the new title already exists
      repositoryMock.countBy.mockResolvedValue(1);
      await expect(
        moviesRepository.updateMovie('Test Movie', { title: 'Another Movie' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('deleteMovie', () => {
    it('should delete a movie if it exists', async () => {
      repositoryMock.findOneBy.mockResolvedValue(mockMovie);
      repositoryMock.delete.mockResolvedValue({ affected: 1 });
      await moviesRepository.deleteMovie('Test Movie');
      expect(repositoryMock.delete).toHaveBeenCalledWith({
        title: 'Test Movie',
      });
    });

    it('should do nothing if movie does not exist', async () => {
      repositoryMock.findOneBy.mockResolvedValue(null);
      const result = await moviesRepository.deleteMovie('Nonexistent');
      expect(result).toBeUndefined();
    });
  });
});
