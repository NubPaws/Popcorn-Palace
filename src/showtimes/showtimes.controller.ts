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

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Get(':showtimeId')
  @HttpCode(200)
  async find(
    @Param('showtimeId') showtimeId: number,
  ): Promise<ResponseShowtimeDto> {
    const showtime = await this.showtimesService.find(showtimeId);
    return new ResponseShowtimeDto(showtime);
  }

  @Post()
  @HttpCode(200)
  async add(
    @Body() createShowtimeDto: CreateShowtimeDto,
  ): Promise<ResponseShowtimeDto> {
    const showtime = await this.showtimesService.add(createShowtimeDto);
    return new ResponseShowtimeDto(showtime);
  }

  @Post('update/:showtimeId')
  @HttpCode(200)
  async update(
    @Param('showtimeId') showtimeId: number,
    @Body() updateShowtimeDto: UpdateShowtimeDto,
  ): Promise<ResponseShowtimeDto> {
    const showtime = await this.showtimesService.update(
      showtimeId,
      updateShowtimeDto,
    );
    return new ResponseShowtimeDto(showtime);
  }

  @Delete(':showtimeId')
  @HttpCode(200)
  async remove(@Param('showtimeId') showtimeId: number): Promise<void> {
    await this.showtimesService.remove(showtimeId);
  }
}
