import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Showtime } from './entities/showtime.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';

@Injectable()
export class ShowtimesRepository {
  constructor(
    @InjectRepository(Showtime)
    private readonly repo: Repository<Showtime>,
  ) {}

  async getShowtime(showtimeId?: number): Promise<Showtime | null> {
    return this.repo.findOneBy({ id: showtimeId });
  }

  async addShowtime(showtime: Showtime): Promise<Showtime> {
    const existingOne = await this.repo.findOne({
      where: {
        theater: showtime.theater,
        startTime: LessThan(showtime.endTime),
        endTime: MoreThan(showtime.startTime),
      },
    });

    if (existingOne) {
      throw new ConflictException(
        'Another show is scheduled in the same theater this time.',
      );
    }

    return this.repo.save(showtime);
  }

  async updateShowtime(
    showtimeId: number,
    updates: Partial<Showtime>,
  ): Promise<Showtime> {
    const showtime = await this.repo.findOneBy({ id: showtimeId });

    Object.assign(showtime, updates);
    return this.repo.save(showtime);
  }

  async deleteShowtime(showtimeId: number): Promise<void> {
    const showtime = await this.getShowtime(showtimeId);

    if (!showtime) {
      return;
    }

    this.repo.delete({ id: showtimeId });
  }
}
