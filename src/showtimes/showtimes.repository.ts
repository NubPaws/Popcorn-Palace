import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Showtime } from './showtime.entity';
import { LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { deleteEmpties } from '../utilities/utils';

@Injectable()
export class ShowtimesRepository {
  constructor(
    @InjectRepository(Showtime)
    private readonly repo: Repository<Showtime>,
  ) {}

  /**
   * Retrieves a showtime by its ID, including its related movie.
   *
   * @param showtimeId - Optional showtime ID to look up.
   * @returns The showtime with its related movie, or null if not found.
   */
  async getShowtime(showtimeId?: number): Promise<Showtime | null> {
    return this.repo.findOne({
      where: { id: showtimeId },
      relations: ['movie'],
    });
  }

  /**
   * Checks whether the given showtime conflicts with any other scheduled
   * showtimes in the same theater based on overlapping time ranges.
   *
   * @param showtime - The showtime entity to check for conflicts.
   * @returns True if a conflicting showtime exists; otherwise, false.
   */
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

  /**
   * Adds a new showtime after verifying that there are no conflicting
   * showtimes in the same theater.
   *
   * @param showtime - The showtime entity to add.
   * @returns The saved showtime entity.
   * @throws ConflictException if a time conflict is detected.
   */
  async addShowtime(showtime: Showtime): Promise<Showtime> {
    if (await this.doesTimeConflict(showtime)) {
      throw new ConflictException(
        'Another show is scheduled in the same theater this time.',
      );
    }

    return this.repo.save(showtime);
  }

  /**
   * Updates an existing showtime with the provided partial data.
   *
   * Validates that no time conflicts are introduced with other showtimes.
   *
   * @param showtimeId - ID of the showtime to update.
   * @param updates - Partial object containing updates to apply.
   * @returns The updated showtime entity.
   * @throws NotFoundException if the showtime does not exist.
   * @throws ConflictException if the updated time conflicts with another show.
   */
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

  /**
   * Deletes a showtime by ID if it exists.
   *
   * @param showtimeId - ID of the showtime to delete.
   */
  async deleteShowtime(showtimeId: number): Promise<void> {
    const showtime = await this.getShowtime(showtimeId);

    if (!showtime) {
      return;
    }

    this.repo.delete({ id: showtimeId });
  }
}
