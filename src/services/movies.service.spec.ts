import { Movie } from '../entities/movie.entity';
import { MoviesService } from './movies.service';
import { Repository } from 'typeorm';
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockMovie: Movie = {
  id: 1,
  title: 'Sample Movie 1',
  genre: 'Action',
  duration: 120,
  rating: 9.8,
  releaseYear: 2025,
};

describe('MoviesService', () => {
  let service: MoviesService;
  let repository: Repository<Movie>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useClass: class {
            find = jest.fn().mockResolvedValue([mockMovie]);
            create = jest.fn().mockReturnValue(mockMovie);
            save = jest.fn().mockResolvedValue(mockMovie);
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    repository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  it('should create a user', async () => {
    const result = await service.create(
      'Sample Movie 1',
      'Action',
      120,
      9.8,
      2025,
    );

    expect(result).toEqual(mockMovie);
    expect(repository.create).toHaveBeenCalledWith({
      title: 'Sample Movie 1',
      genre: 'Action',
      duration: 120,
      rating: 9.8,
      releaseYear: 2025,
    });
    expect(repository.save).toHaveBeenCalledWith(mockMovie);
  });

  it('should return all users', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockMovie]);
    expect(repository.find).toHaveBeenCalled();
  });
});
