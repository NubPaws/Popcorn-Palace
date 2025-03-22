import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from '../bookings.service';
import { BookingsRepository } from '../bookings.repository';
import { ShowtimesRepository } from '../../showtimes/showtimes.repository';
import { CreateBookingDto } from '../bookings.dto';
import { BadRequestException } from '@nestjs/common';

describe('BookingsService', () => {
  let service: BookingsService;

  const mockBookingsRepository = {
    createBooking: jest.fn(),
  };

  const mockShowtimesRepository = {
    getShowtime: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: BookingsRepository, useValue: mockBookingsRepository },
        { provide: ShowtimesRepository, useValue: mockShowtimesRepository },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('bookSeat', () => {
    it('should throw a BadRequestException if the showtime does not exist', async () => {
      const createBookingDto: CreateBookingDto = {
        showtimeId: 1,
        seatNumber: 15,
        userId: '84438967-f68f-4fa0-b620-0f08217e76af',
      };

      mockShowtimesRepository.getShowtime.mockResolvedValue(null);

      await expect(service.bookSeat(createBookingDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockShowtimesRepository.getShowtime).toHaveBeenCalledWith(
        createBookingDto.showtimeId,
      );
    });

    it('should return a booking when booking is successful', async () => {
      const createBookingDto: CreateBookingDto = {
        showtimeId: 1,
        seatNumber: 15,
        userId: '84438967-f68f-4fa0-b620-0f08217e76af',
      };

      const showtime = { id: 1 }; // minimal showtime object
      const booking = {
        id: 'test-booking-id',
        userId: createBookingDto.userId,
        seatNumber: createBookingDto.seatNumber,
        showtime,
      };

      mockShowtimesRepository.getShowtime.mockResolvedValue(showtime);
      mockBookingsRepository.createBooking.mockResolvedValue(booking);

      const result = await service.bookSeat(createBookingDto);

      expect(result).toEqual(booking);
      expect(mockShowtimesRepository.getShowtime).toHaveBeenCalledWith(
        createBookingDto.showtimeId,
      );
      expect(mockBookingsRepository.createBooking).toHaveBeenCalled();
    });
  });
});
