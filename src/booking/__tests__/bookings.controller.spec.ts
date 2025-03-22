import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from '../bookings.controller';
import { BookingsService } from '../bookings.service';
import { CreateBookingDto } from '../bookings.dto';

describe('BookingsController', () => {
  let controller: BookingsController;

  const mockBookingsService = {
    bookSeat: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: mockBookingsService,
        },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addBooking', () => {
    it('should return a booking response on success', async () => {
      const createBookingDto: CreateBookingDto = {
        showtimeId: 1,
        seatNumber: 15,
        userId: '84438967-f68f-4fa0-b620-0f08217e76af',
      };
      const booking = { id: 'test-booking-id' };
      mockBookingsService.bookSeat.mockResolvedValue(booking);

      const result = await controller.addBooking(createBookingDto);

      expect(result).toEqual({ bookingId: booking.id });
      expect(mockBookingsService.bookSeat).toHaveBeenCalledWith(
        createBookingDto,
      );
    });
  });
});
