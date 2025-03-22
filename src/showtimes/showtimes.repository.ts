import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Showtime } from './showtime.entity';
import { LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { deleteEmpties } from '../utils';

@Injectable()
export class ShowtimesRepository {
  constructor(
    @InjectRepository(Showtime)
    private readonly repo: Repository<Showtime>,
  ) {}

  async getShowtime(showtimeId?: number): Promise<Showtime | null> {
    return this.repo.findOne({
      where: { id: showtimeId },
      relations: ['movie'],
    });
  }

  async doesTimeConflict(showtime: Showtime): Promise<boolean> {
    return this.repo.exists({
      where: {
        id: Not(showtime.id ?? -1),
        theater: showtime.theater,
        startTime: LessThanOrEqual(showtime.endTime),
        endTime: MoreThanOrEqual(showtime.startTime),
      },
    });
  }

  async addShowtime(showtime: Showtime): Promise<Showtime> {
    if (await this.doesTimeConflict(showtime)) {
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
    if (!showtime) {
      throw new NotFoundException(`Showtime #${showtimeId} does not exist`);
    }

    deleteEmpties(updates);

    Object.assign(showtime, updates);

    if (await this.doesTimeConflict(showtime)) {
      throw new ConflictException(
        'Another show is scheduled in the same theater this time.',
      );
    }

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
