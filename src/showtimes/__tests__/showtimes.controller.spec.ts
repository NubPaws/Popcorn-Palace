import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesController } from '../showtimes.controller';
import { ShowtimesService } from '../showtimes.service';
import { Showtime } from '../showtime.entity';
import { CreateShowtimeDto, UpdateShowtimeDto } from '../showtimes.dto';

describe('ShowtimesController', () => {
  let controller: ShowtimesController;

  const mockShowtimesService = {
    find: jest.fn(),
    add: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowtimesController],
      providers: [
        {
          provide: ShowtimesService,
          useValue: mockShowtimesService,
        },
      ],
    }).compile();

    controller = module.get<ShowtimesController>(ShowtimesController);
    jest.clearAllMocks();
  });

  describe('find', () => {
    it('should return a ResponseShowtimeDto', async () => {
      const showtime = new Showtime();
      showtime.id = 1;
      showtime.price = 15;
      showtime.theater = 'Theater 1';
      showtime.startTime = new Date('2025-03-21T10:00:00Z');
      showtime.endTime = new Date('2025-03-21T12:00:00Z');
      Object.defineProperty(showtime, 'movieId', { get: () => 1 });

      mockShowtimesService.find.mockResolvedValue(showtime);

      const result = await controller.find(1);
      expect(result).toEqual({
        id: 1,
        price: 15,
        theater: 'Theater 1',
        startTime: showtime.startTime.toISOString(),
        endTime: showtime.endTime.toISOString(),
        movieId: 1,
      });
    });
  });

  describe('add', () => {
    it('should add and return a ResponseShowtimeDto', async () => {
      const createDto: CreateShowtimeDto = {
        movieId: 1,
        price: 15,
        theater: 'Theater 1',
        startTime: '2025-03-21T10:00:00Z',
        endTime: '2025-03-21T12:00:00Z',
      };

      const showtime = new Showtime();
      showtime.id = 1;
      showtime.price = 15;
      showtime.theater = 'Theater 1';
      showtime.startTime = new Date(createDto.startTime);
      showtime.endTime = new Date(createDto.endTime);
      Object.defineProperty(showtime, 'movieId', { get: () => 1 });

      mockShowtimesService.add.mockResolvedValue(showtime);

      const result = await controller.add(createDto);
      expect(result).toEqual({
        id: 1,
        price: 15,
        theater: 'Theater 1',
        startTime: showtime.startTime.toISOString(),
        endTime: showtime.endTime.toISOString(),
        movieId: 1,
      });
    });
  });

  describe('update', () => {
    it('should update and return a ResponseShowtimeDto', async () => {
      const updateDto: UpdateShowtimeDto = {
        price: 20,
        theater: 'Theater 2',
        startTime: '2025-03-21T11:00:00Z',
        endTime: '2025-03-21T13:00:00Z',
      };

      const showtime = new Showtime();
      showtime.id = 1;
      showtime.price = 20;
      showtime.theater = 'Theater 2';
      showtime.startTime = new Date(updateDto.startTime);
      showtime.endTime = new Date(updateDto.endTime);
      Object.defineProperty(showtime, 'movieId', { get: () => 1 });

      mockShowtimesService.update.mockResolvedValue(showtime);

      const result = await controller.update(1, updateDto);
      expect(result).toEqual({
        id: 1,
        price: 20,
        theater: 'Theater 2',
        startTime: showtime.startTime.toISOString(),
        endTime: showtime.endTime.toISOString(),
        movieId: 1,
      });
    });
  });

  describe('remove', () => {
    it('should call remove on the service', async () => {
      mockShowtimesService.remove.mockResolvedValue(undefined);

      await controller.remove(1);
      expect(mockShowtimesService.remove).toHaveBeenCalledWith(1);
    });
  });
});
