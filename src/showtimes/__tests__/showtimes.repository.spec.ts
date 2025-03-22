import { Repository } from 'typeorm';
import { Showtime } from '../showtime.entity';
import { ShowtimesRepository } from '../showtimes.repository';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ShowtimesRepository', () => {
  let showtimesRepository: ShowtimesRepository;
  let repo: Repository<Showtime>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ShowtimesRepository,
        {
          provide: getRepositoryToken(Showtime),
          useClass: Repository,
        },
      ],
    }).compile();

    showtimesRepository = module.get<ShowtimesRepository>(ShowtimesRepository);
    repo = module.get<Repository<Showtime>>(getRepositoryToken(Showtime));
  });

  describe('getShowtime', () => {
    it('should return a showtime if found', async () => {
      const showtime = new Showtime();
      showtime.id = 1;
      jest.spyOn(repo, 'findOne').mockResolvedValue(showtime);

      const result = await showtimesRepository.getShowtime(1);
      expect(result).toEqual(showtime);
    });

    it('should return null if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);

      const result = await showtimesRepository.getShowtime(999);
      expect(result).toBeNull();
    });
  });

  describe('doesTimeConflict', () => {
    it('should return true if conflict exists', async () => {
      const showtime = new Showtime();
      showtime.id = 1;
      showtime.theater = 'Theater 1';
      showtime.startTime = new Date('2025-03-21T10:00:00Z');
      showtime.endTime = new Date('2025-03-21T12:00:00Z');

      jest.spyOn(repo, 'exists').mockResolvedValue(true);

      const result = await showtimesRepository.doesTimeConflict(showtime);
      expect(result).toBe(true);
    });

    it('should return false if no conflict', async () => {
      const showtime = new Showtime();
      showtime.id = 1;
      showtime.theater = 'Theater 1';
      showtime.startTime = new Date('2025-03-21T10:00:00Z');
      showtime.endTime = new Date('2025-03-21T12:00:00Z');

      jest.spyOn(repo, 'exists').mockResolvedValue(false);

      const result = await showtimesRepository.doesTimeConflict(showtime);
      expect(result).toBe(false);
    });
  });

  describe('addShowtime', () => {
    it('should add showtime if no conflict', async () => {
      const showtime = new Showtime();
      showtime.theater = 'Theater 1';
      showtime.startTime = new Date('2025-03-21T10:00:00Z');
      showtime.endTime = new Date('2025-03-21T12:00:00Z');

      jest
        .spyOn(showtimesRepository, 'doesTimeConflict')
        .mockResolvedValue(false);
      jest.spyOn(repo, 'save').mockResolvedValue(showtime);

      const result = await showtimesRepository.addShowtime(showtime);
      expect(result).toEqual(showtime);
    });

    it('should throw ConflictException if conflict exists', async () => {
      const showtime = new Showtime();
      showtime.theater = 'Theater 1';
      showtime.startTime = new Date('2025-03-21T10:00:00Z');
      showtime.endTime = new Date('2025-03-21T12:00:00Z');

      jest
        .spyOn(showtimesRepository, 'doesTimeConflict')
        .mockResolvedValue(true);

      await expect(showtimesRepository.addShowtime(showtime)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('updateShowtime', () => {
    it('should update showtime if exists and no conflict', async () => {
      const originalShowtime = new Showtime();
      originalShowtime.id = 1;
      originalShowtime.theater = 'Theater 1';
      originalShowtime.startTime = new Date('2025-03-21T10:00:00Z');
      originalShowtime.endTime = new Date('2025-03-21T12:00:00Z');

      jest.spyOn(repo, 'findOneBy').mockResolvedValue(originalShowtime);
      const updates = { theater: 'Theater 2' };
      Object.assign(originalShowtime, updates);
      jest
        .spyOn(showtimesRepository, 'doesTimeConflict')
        .mockResolvedValue(false);
      jest.spyOn(repo, 'save').mockResolvedValue(originalShowtime);

      const result = await showtimesRepository.updateShowtime(1, updates);
      expect(result.theater).toEqual('Theater 2');
    });

    it('should throw NotFoundException if showtime does not exist', async () => {
      jest.spyOn(repo, 'findOneBy').mockResolvedValue(null);

      await expect(showtimesRepository.updateShowtime(999, {})).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if time conflict occurs', async () => {
      const originalShowtime = new Showtime();
      originalShowtime.id = 1;
      originalShowtime.theater = 'Theater 1';
      originalShowtime.startTime = new Date('2025-03-21T10:00:00Z');
      originalShowtime.endTime = new Date('2025-03-21T12:00:00Z');

      jest.spyOn(repo, 'findOneBy').mockResolvedValue(originalShowtime);

      const updates = {
        theater: 'Theater 1',
        startTime: new Date('2025-03-21T11:00:00Z'),
        endTime: new Date('2025-03-21T13:00:00Z'),
      };
      Object.assign(originalShowtime, updates);
      jest
        .spyOn(showtimesRepository, 'doesTimeConflict')
        .mockResolvedValue(true);

      await expect(
        showtimesRepository.updateShowtime(1, updates),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('deleteShowtime', () => {
    it('should delete showtime if exists', async () => {
      const showtime = new Showtime();
      showtime.id = 1;

      jest
        .spyOn(showtimesRepository, 'getShowtime')
        .mockResolvedValue(showtime);
      const deleteSpy = jest
        .spyOn(repo, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      await showtimesRepository.deleteShowtime(1);
      expect(deleteSpy).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
