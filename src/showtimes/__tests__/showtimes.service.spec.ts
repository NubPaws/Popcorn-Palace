import { Test, TestingModule } from '@nestjs/testing';
import { MoviesRepository } from '../../movies/movies.repository';
import { ShowtimesRepository } from '../showtimes.repository';
import { ShowtimesService } from '../showtimes.service';
import { Showtime } from '../entities/showtime.entity';
import { Movie } from '../../movies/entities/movie.entity';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

describe('ShowtimesService', () => {
  let service: ShowtimesService;

  const mockShowtimesRepository = {
    getShowtime: jest.fn(),
    addShowtime: jest.fn(),
    updateShowtime: jest.fn(),
    deleteShowtime: jest.fn(),
  };

  const mockMoviesRepository = {
    getById: jest.fn(),
    existsById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowtimesService,
        { provide: ShowtimesRepository, useValue: mockShowtimesRepository },
        { provide: MoviesRepository, useValue: mockMoviesRepository },
      ],
    }).compile();

    service = module.get<ShowtimesService>(ShowtimesService);
    jest.clearAllMocks();
  });

  describe('find', () => {
    it('should return a showtime when found', async () => {
      const showtime = new Showtime();
      showtime.id = 1;
      mockShowtimesRepository.getShowtime.mockResolvedValue(showtime);
      const result = await service.find(1);
      expect(result).toEqual(showtime);
    });

    it('should throw NotFoundException when not found', async () => {
      mockShowtimesRepository.getShowtime.mockResolvedValue(null);
      await expect(service.find(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('add', () => {
    it('should add a showtime successfully', async () => {
      const movie = new Movie();
      movie.id = 1;
      movie.duration = 120;

      const createDto = {
        movieId: movie.id,
        price: 10.5,
        theater: 'Theater 1',
        startTime: '2025-03-21T10:00:00Z',
        endTime: '2025-03-21T12:00:00Z',
      };

      mockMoviesRepository.getById.mockResolvedValue(movie);
      const showtime = new Showtime();
      showtime.id = 1;
      Object.assign(showtime, {
        movie,
        price: createDto.price,
        theater: createDto.theater,
        startTime: new Date(createDto.startTime),
        endTime: new Date(createDto.endTime),
      });
      mockShowtimesRepository.addShowtime.mockResolvedValue(showtime);

      const result = await service.add(createDto);
      expect(result).toEqual(showtime);
    });

    it('should throw BadRequestException if movie does not exist', async () => {
      const createDto = {
        movieId: 999,
        price: 10.5,
        theater: 'Theater 1',
        startTime: '2025-03-21T10:00:00Z',
        endTime: '2025-03-21T12:00:00Z',
      };

      mockMoviesRepository.getById.mockResolvedValue(null);
      await expect(service.add(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if time conflict occurs', async () => {
      const movie = new Movie();
      movie.id = 1;
      movie.duration = 120;
      const createDto = {
        movieId: movie.id,
        price: 10.5,
        theater: 'Theater 1',
        startTime: '2025-03-21T10:00:00Z',
        endTime: '2025-03-21T12:00:00Z',
      };

      mockMoviesRepository.getById.mockResolvedValue(movie);
      mockShowtimesRepository.addShowtime.mockRejectedValue(
        new ConflictException('Time conflict'),
      );
      await expect(service.add(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update a showtime successfully', async () => {
      const movie = new Movie();
      movie.id = 1;
      movie.duration = 120;

      const existingShowtime = new Showtime();
      existingShowtime.id = 1;
      existingShowtime.theater = 'Theater 1';
      existingShowtime.startTime = new Date('2025-03-21T10:00:00Z');
      existingShowtime.endTime = new Date('2025-03-21T12:00:00Z');
      existingShowtime.movie = movie;

      mockShowtimesRepository.getShowtime.mockResolvedValue(existingShowtime);
      mockMoviesRepository.getById.mockResolvedValue(movie);

      const updateDto = {
        movieId: movie.id,
        price: 12,
        theater: 'Theater 2',
        startTime: '2025-03-21T11:00:00Z',
        endTime: '2025-03-21T13:00:00Z',
      };

      const updatedShowtime = {
        ...existingShowtime,
        price: 12,
        theater: 'Theater 2',
        startTime: new Date(updateDto.startTime),
        endTime: new Date(updateDto.endTime),
      };
      mockShowtimesRepository.updateShowtime.mockResolvedValue(updatedShowtime);

      const result = await service.update(1, updateDto);
      expect(result.theater).toEqual('Theater 2');
      expect(result.price).toEqual(12);
    });
  });

  describe('remove', () => {
    it('should remove a showtime', async () => {
      mockShowtimesRepository.deleteShowtime.mockResolvedValue(undefined);
      await service.remove(1);
      expect(mockShowtimesRepository.deleteShowtime).toHaveBeenCalledWith(1);
    });
  });
});
