import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from '../movies.controller';
import { MoviesService } from '../movies.service';
import { Movie } from '../entities/movie.entity';
import { CreateMovieDto, UpdateMovieDto } from '../movies.dto';

describe('MoviesController', () => {
  let moviesController: MoviesController;

  const mockMovie: Movie = new Movie({
    title: 'Test Movie',
    genre: 'Drama',
    duration: 120,
    rating: 8.5,
    releaseYear: 2020,
  });

  const moviesServiceMock = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: moviesServiceMock,
        },
      ],
    }).compile();

    moviesController = module.get<MoviesController>(MoviesController);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      moviesServiceMock.findAll.mockResolvedValue([mockMovie]);
      const movies = await moviesController.findAll();

      expect(movies).toEqual([mockMovie]);
      expect(moviesServiceMock.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a movie', async () => {
      moviesServiceMock.create.mockResolvedValue(mockMovie);
      const createMovieDto: CreateMovieDto = {
        title: 'Test Movie',
        genre: 'Drama',
        duration: 120,
        rating: 8.5,
        releaseYear: 2020,
      };

      const result = await moviesController.create(createMovieDto);
      expect(result).toEqual(mockMovie);
      // Consider create converts dto to Movie object.
      expect(moviesServiceMock.create).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('update', () => {
    it('should update a movie', async () => {
      moviesServiceMock.update.mockResolvedValue({
        ...mockMovie,
        genre: 'Comedy',
      });

      const updateMovieDto: UpdateMovieDto = { genre: 'Comedy' };
      const result = await moviesController.update(
        'Test Movie',
        updateMovieDto,
      );

      expect(result.genre).toEqual('Comedy');
      expect(moviesServiceMock.update).toHaveBeenCalledWith(
        'Test Movie',
        updateMovieDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a movie', async () => {
      moviesServiceMock.remove.mockResolvedValue({ affected: 1 });
      await moviesController.remove('Test Movie');
      expect(moviesServiceMock.remove).toHaveBeenCalledWith('Test Movie');
    });
  });
});
