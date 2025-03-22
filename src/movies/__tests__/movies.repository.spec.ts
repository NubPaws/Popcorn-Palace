import { Repository } from 'typeorm';
import { MoviesRepository } from '../movies.repository';
import { Movie } from '../movie.entity';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('MoviesRepository', () => {
  let moviesRepository: MoviesRepository;
  let repo: Repository<Movie>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MoviesRepository,
        {
          provide: getRepositoryToken(Movie),
          useClass: Repository,
        },
      ],
    }).compile();

    moviesRepository = module.get<MoviesRepository>(MoviesRepository);
    repo = module.get<Repository<Movie>>(getRepositoryToken(Movie));

    jest.clearAllMocks();
  });

  describe('getByTitle', () => {
    it('should return a movie when found', async () => {
      const movie = new Movie();
      movie.id = 1;
      movie.title = 'Test Movie';
      const spy = jest.spyOn(repo, 'findOneBy').mockResolvedValue(movie);

      const result = await moviesRepository.getByTitle('Test Movie');
      expect(result).toEqual(movie);
      expect(spy).toHaveBeenCalled();
    });

    it('should return null when not found', async () => {
      jest.spyOn(repo, 'findOneBy').mockResolvedValue(null);

      const result = await moviesRepository.getByTitle('Random title here');
      expect(result).toBeNull();
    });
  });

  describe('getById', () => {
    it('should return a movie when found', async () => {
      const movie = new Movie();
      movie.id = 1;
      jest.spyOn(repo, 'findOneBy').mockResolvedValue(movie);

      const result = await moviesRepository.getById(1);
      expect(result).toEqual(movie);
    });

    it('should return null when not found', async () => {
      jest.spyOn(repo, 'findOneBy').mockResolvedValue(null);

      const result = await moviesRepository.getById(999);
      expect(result).toBeNull();
    });
  });

  describe('existsByTitle', () => {
    it('should return true if movie exists', async () => {
      jest.spyOn(repo, 'countBy').mockResolvedValue(1);

      const result = await moviesRepository.existsByTitle('Test Movie');
      expect(result).toBe(true);
    });

    it('should return false if movie does not exist', async () => {
      jest.spyOn(repo, 'countBy').mockResolvedValue(0);

      const result = await moviesRepository.existsByTitle('Random movie');
      expect(result).toBe(false);
    });
  });

  describe('existsById', () => {
    it('should return true if movie exists', async () => {
      jest.spyOn(repo, 'countBy').mockResolvedValue(1);

      const result = await moviesRepository.existsById(1);
      expect(result).toBe(true);
    });

    it('should return false if movie does not exist', async () => {
      jest.spyOn(repo, 'countBy').mockResolvedValue(0);

      const result = await moviesRepository.existsById(999);
      expect(result).toBe(false);
    });
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const moviesArray = [new Movie(), new Movie()];
      jest.spyOn(repo, 'find').mockResolvedValue(moviesArray);

      const result = await moviesRepository.findAll();
      expect(result).toEqual(moviesArray);
    });
  });

  describe('saveMovie', () => {
    it('should save a new movie', async () => {
      const movie = new Movie();
      movie.title = 'Unique Movie';

      jest.spyOn(moviesRepository, 'existsByTitle').mockResolvedValue(false);
      jest.spyOn(repo, 'save').mockResolvedValue(movie);

      const result = await moviesRepository.saveMovie(movie);
      expect(result).toEqual(movie);
    });

    it('should throw ConflictException if title already exists', async () => {
      const movie = new Movie();
      movie.title = 'Duplicate Movie';
      jest.spyOn(moviesRepository, 'existsByTitle').mockResolvedValue(true);

      await expect(moviesRepository.saveMovie(movie)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('updateMovie', () => {
    it('should update a movie', async () => {
      const movie = new Movie();
      movie.id = 1;
      movie.title = 'Original Title';

      jest.spyOn(moviesRepository, 'getByTitle').mockResolvedValue(movie);
      jest.spyOn(moviesRepository, 'existsByTitle').mockResolvedValue(false);
      jest
        .spyOn(repo, 'save')
        .mockResolvedValue({ ...movie, title: 'Updated Title' });

      const result = await moviesRepository.updateMovie('Original Title', {
        title: 'Updated Title',
      });
      expect(result.title).toEqual('Updated Title');
    });

    it('should throw NotFoundException if movie not found', async () => {
      jest.spyOn(moviesRepository, 'getByTitle').mockResolvedValue(null);

      await expect(
        moviesRepository.updateMovie('Random movie', { title: 'New Title' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if new title exists', async () => {
      const movie = new Movie();
      movie.id = 1;
      movie.title = 'Original Title';

      jest.spyOn(moviesRepository, 'getByTitle').mockResolvedValue(movie);
      jest.spyOn(moviesRepository, 'existsByTitle').mockResolvedValue(true);

      await expect(
        moviesRepository.updateMovie('Original Title', {
          title: 'Duplicate Title',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('deleteMovie', () => {
    it('should delete a movie if it exists', async () => {
      const movie = new Movie();
      movie.id = 1;
      movie.title = 'Test Movie';

      jest.spyOn(moviesRepository, 'getByTitle').mockResolvedValue(movie);
      const deleteSpy = jest
        .spyOn(repo, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      await moviesRepository.deleteMovie('Test Movie');
      expect(deleteSpy).toHaveBeenCalledWith({ title: 'Test Movie' });
    });

    it('should not throw error if movie does not exist', async () => {
      jest.spyOn(moviesRepository, 'getByTitle').mockResolvedValue(null);

      await expect(
        moviesRepository.deleteMovie('Random movie'),
      ).resolves.not.toThrow();
    });
  });
});
