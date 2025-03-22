import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
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

  /**
   * Retrieves a specific showtime by its ID.
   *
   * @param showtimeId - ID of the showtime to retrieve.
   * @returns A response DTO representing the showtime.
   */
  @Get(':showtimeId')
  @HttpCode(200)
  async find(
    @Param('showtimeId', ParseIntPipe) showtimeId: number,
  ): Promise<ResponseShowtimeDto> {
    const showtime = await this.showtimesService.find(showtimeId);
    return new ResponseShowtimeDto(showtime);
  }

  /**
   * Creates a new showtime.
   *
   * @param createShowtimeDto - DTO containing the new showtime details.
   * @returns A response DTO representing the newly created showtime.
   */
  @Post()
  @HttpCode(200)
  async add(
    @Body() createShowtimeDto: CreateShowtimeDto,
  ): Promise<ResponseShowtimeDto> {
    const showtime = await this.showtimesService.add(createShowtimeDto);
    return new ResponseShowtimeDto(showtime);
  }

  /**
   * Updates an existing showtime by its ID.
   *
   * @param showtimeId - ID of the showtime to update.
   * @param updateShowtimeDto - DTO containing the fields to update.
   * @returns A response DTO representing the updated showtime.
   */
  @Post('update/:showtimeId')
  @HttpCode(200)
  async update(
    @Param('showtimeId', ParseIntPipe) showtimeId: number,
    @Body() updateShowtimeDto: UpdateShowtimeDto,
  ): Promise<ResponseShowtimeDto> {
    const showtime = await this.showtimesService.update(
      showtimeId,
      updateShowtimeDto,
    );
    return new ResponseShowtimeDto(showtime);
  }

  /**
   * Deletes a showtime by its ID.
   *
   * @param showtimeId - ID of the showtime to delete.
   */
  @Delete(':showtimeId')
  @HttpCode(200)
  async remove(
    @Param('showtimeId', ParseIntPipe) showtimeId: number,
  ): Promise<void> {
    await this.showtimesService.remove(showtimeId);
  }
}
