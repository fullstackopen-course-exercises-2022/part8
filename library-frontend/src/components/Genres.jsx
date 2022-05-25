import React from 'react';

const Genres = ({ genres, setGenre }) => {
    console.log(genres)
    return (
        <div>
            <button onClick={() => setGenre(null)}>all genres</button>
            {genres?.map((genre) => (
                <button key={genre} onClick={() => setGenre(genre)}>{genre}</button>
            ))}
        </div>
    );
}

export default Genres;