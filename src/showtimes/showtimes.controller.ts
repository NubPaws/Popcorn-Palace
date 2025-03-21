import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import {
  CreateShowtimeDto,
  ResponseShowtimeDto,
  UpdateShowtimeDto,
} from './showtimes.dto';
import { ShowtimesService } from './showtimes.service';
import { Showtime } from './entities/showtime.entity';

function responseFromShowtime(showtime: Showtime): ResponseShowtimeDto {
  return {
    id: showtime.id,
    movieId: showtime.movieId,
    theater: showtime.theater,
    price: showtime.price,
    startTime: showtime.startTime.toISOString(),
    endTime: showtime.endTime.toISOString(),
  } as ResponseShowtimeDto;
}

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Get(':showtimeId')
  @HttpCode(200)
  async find(@Param('showtimeId') showtimeId: number) {
    const showtime = await this.showtimesService.find(showtimeId);
    return responseFromShowtime(showtime);
  }

  @Post()
  @HttpCode(200)
  async add(
    @Body() createShowtimeDto: CreateShowtimeDto,
  ): Promise<ResponseShowtimeDto> {
    const showtime = await this.showtimesService.add(
      new Showtime(createShowtimeDto),
    );

    return responseFromShowtime(showtime);
  }

  @Post('update/:showtimeId')
  @HttpCode(200)
  async update(
    @Param('showtimeId') showtimeId: number,
    @Body() updateShowtimeDto: UpdateShowtimeDto,
  ) {
    const { startTime, endTime } = updateShowtimeDto;

    const updatedData: Partial<Showtime> = {
      ...updateShowtimeDto,
      startTime: startTime ? new Date(startTime) : undefined,
      endTime: endTime ? new Date(endTime) : undefined,
    };

    const showtime = await this.showtimesService.update(
      showtimeId,
      updatedData,
    );
    return responseFromShowtime(showtime);
  }

  @Delete(':showtimeId')
  @HttpCode(200)
  async remove(@Param('showtimeId') showtimeId: number) {
    this.showtimesService.remove(showtimeId);
  }
}
