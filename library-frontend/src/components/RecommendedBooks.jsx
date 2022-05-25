import React, { useState, useEffect } from 'react'
import { ME, GET_BOOKS_BY_GENRE } from '../queries'
import { useQuery, useLazyQuery } from '@apollo/client'

const RecommendedBooks = ({ show }) => {
    const [ getBooks, results ] = useLazyQuery(GET_BOOKS_BY_GENRE)
    const me = useQuery(ME)
    const [favorite, setFavorite] = useState([])
    useEffect(() => {
        if(results.data) {
            setFavorite(results.data.getBooks)
        }
    }, [results])
    console.log(favorite)
    useEffect(() => {
        if(me.data) {
            getBooks({ variables: { genre: me.data.me.favoriteGenre } })
        }
    }, [getBooks, me])
    if (!show) {
        return null
    }

    return (
        <div>
            <br/>
            {me?.data?.me?.favoriteGenre}
            <table>
                <tbody>
                <tr>
                    <th>Book Names</th>
                    <th>author</th>
                    <th>published</th>
                </tr>
            {favorite?.length > 0 ? favorite?.map((fav) => (
                <tr key={fav.id}>
                    <td>{fav.title}</td>
                    <td>{fav.author.name}</td>
                    <td>{fav.published}</td>
                </tr>
            )): <p>Could not find you a recommended list of books!</p>}
                </tbody>
            </table>
        </div>
    );
}

export default RecommendedBooks;