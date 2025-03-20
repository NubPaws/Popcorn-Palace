import { Injectable } from '@nestjs/common';
import { ShowtimesRepository } from './showtimes.repository';

@Injectable()
export class ShowtimesService {
  constructor(private readonly showtimesRepository: ShowtimesRepository) {}
}
