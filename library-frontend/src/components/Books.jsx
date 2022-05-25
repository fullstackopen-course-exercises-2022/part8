import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GET_ALL_BOOKS } from '../queries'
import Genres from './Genres'

const Books = ({ show }) => {
  const results = useQuery(GET_ALL_BOOKS)
  const books = results?.data?.getBooks
  const [genre, setGenre] = useState(null)
  const [genres, setGenres] = useState('')
  const [ genreBooks, setGenresBooks ] = useState(books)

  useEffect(() => {
      const genreList = []
      books?.forEach(book => {
        if (book.genres) {
          book?.genres?.forEach((genre) => {
            genreList[genre] = genre
          })
        }
      })
      setGenres(Object.keys(genreList))
  }, [books])
    console.log(genreBooks)

  useEffect(() => {
    const genreFilter = !genre ? books : books?.filter((book) => book?.genres?.includes(genre))
    setGenresBooks(genreFilter)
  }, [books, genre])
    console.log(genre)

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th>Book Names</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {genreBooks?.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Genres genres={genres} setGenre={setGenre} />
    </div>
  )
}

export default Books
