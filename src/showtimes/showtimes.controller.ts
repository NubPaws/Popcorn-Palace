import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { CreateShowtimeDto, UpdateShowtimeDto } from './showtimes.dto';
import { ShowtimesService } from './showtimes.service';
import { Showtime } from './entities/showtime.entity';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Get(':showtimeId')
  @HttpCode(200)
  async find(@Param('showtimeId') showtimeId: number) {
    return this.showtimesService.find(showtimeId);
  }

  @Post()
  @HttpCode(200)
  async add(@Body() createShowtimeDto: CreateShowtimeDto) {
    return this.showtimesService.add(new Showtime(createShowtimeDto));
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

    return this.showtimesService.update(showtimeId, updatedData);
  }

  @Delete(':showtimeId')
  @HttpCode(200)
  async remove(@Param('showtimeId') showtimeId: number) {
    this.showtimesService.remove(showtimeId);
  }
}
