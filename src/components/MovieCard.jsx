import React from 'react'

const MovieCard = ({movie: {title, vote_average, poster_path, release_date, original_language}}) => {
  return (
    <div className='movie-card'>
        <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}`: '/no-movie.png'} alt={title} />
        <div>
            <h3>{title}</h3>
            <div className=' content'>
                <div className='rating'>
                    <img src="/public/star.svg" alt="star icon" />
                    <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                </div>
                <span className=' content span'>❝</span>
                <p className='lang'>{original_language}</p>
                <span className=' content span'>❞</span>
                <span className='content span'>®</span>
                <p className='year'>{release_date ? release_date.split('-')[0] : 'N/A'}</p>
            </div>
        </div>
    </div>
  )
}

export default MovieCard