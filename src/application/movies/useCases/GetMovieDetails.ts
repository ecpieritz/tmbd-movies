import type { MovieDetails } from '@/domain/movies/entities/MovieDetails';
import type { MovieRepository } from '@/domain/movies/repositories/MovieRepository';

export interface GetMovieDetails {
  execute(movieId: number): Promise<MovieDetails>;
}

export class GetMovieDetailsUseCase implements GetMovieDetails {
  constructor(private readonly movieRepository: MovieRepository) {}

  execute(movieId: number): Promise<MovieDetails> {
    return this.movieRepository.getMovieDetails(movieId);
  }
}
