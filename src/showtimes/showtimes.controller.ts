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

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Get(':showtimeId')
  @HttpCode(200)
  async find(@Param('showtimeId') showtimeId: number) {
    return { showtimeId };
  }

  @Post()
  @HttpCode(200)
  async add(@Body() createShowtimeDto: CreateShowtimeDto) {
    return createShowtimeDto;
  }

  @Post('update/:showtimeId')
  @HttpCode(200)
  async update(
    @Param('showtimeId') showtimeId: number,
    @Body() updateShowtimeDto: UpdateShowtimeDto,
  ) {
    return { showtimeId, updateShowtimeDto };
  }

  @Delete(':showtimeId')
  @HttpCode(200)
  async remove(@Param('showtimeId') showtimeId: number) {
    return showtimeId;
  }
}
