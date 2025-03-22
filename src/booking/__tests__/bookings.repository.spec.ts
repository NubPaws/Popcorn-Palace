import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BookingsRepository } from '../bookings.repository';
import { Booking } from '../booking.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('BookingsRepository', () => {
  let repository: BookingsRepository;
  let repoMock: { exists?: jest.Mock; save?: jest.Mock };

  beforeEach(async () => {
    repoMock = {
      exists: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsRepository,
        {
          provide: getRepositoryToken(Booking),
          useValue: repoMock,
        },
      ],
    }).compile();

    repository = module.get<BookingsRepository>(BookingsRepository);
    // Manually assign the mock to the repository's internal property
    (repository as any).repo = repoMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isSeatTaken', () => {
    it('should return true when the seat is taken', async () => {
      repoMock.exists.mockResolvedValue(true);
      const result = await repository.isSeatTaken(1, 15);
      expect(result).toBe(true);
      expect(repoMock.exists).toHaveBeenCalledWith({
        where: { showtimeId: 1, seatNumber: 15 },
      });
    });

    it('should return false when the seat is not taken', async () => {
      repoMock.exists!.mockResolvedValue(false);
      const result = await repository.isSeatTaken(1, 15);
      expect(result).toBe(false);
    });
  });

  describe('createBooking', () => {
    it('should throw a ConflictException if the seat is already taken', async () => {
      const booking: Booking = {
        id: 'test-id',
        userId: 'user-uuid',
        seatNumber: 15,
        showtime: {
          id: 1,
          theater: 'Theater 1',
          movie: { title: 'Test Movie' },
          startTime: new Date('2025-03-22T10:00:00Z'),
          endTime: new Date('2025-03-22T12:00:00Z'),
        },
      } as any;

      repoMock.exists.mockResolvedValue(true);
      await expect(repository.createBooking(booking)).rejects.toThrow(
        ConflictException,
      );
      expect(repoMock.exists).toHaveBeenCalledWith({
        where: {
          showtimeId: booking.showtime.id,
          seatNumber: booking.seatNumber,
        },
      });
    });

    it('should save and return the booking when the seat is available', async () => {
      const booking: Booking = {
        id: 'test-id',
        userId: 'user-uuid',
        seatNumber: 15,
        showtime: {
          id: 1,
          theater: 'Theater 1',
          movie: { title: 'Test Movie' },
          startTime: new Date('2025-03-22T10:00:00Z'),
          endTime: new Date('2025-03-22T12:00:00Z'),
        },
      } as any;

      repoMock.exists.mockResolvedValue(false);
      repoMock.save.mockResolvedValue(booking);

      const result = await repository.createBooking(booking);
      expect(result).toEqual(booking);
      expect(repoMock.save).toHaveBeenCalledWith(booking);
    });
  });
});
