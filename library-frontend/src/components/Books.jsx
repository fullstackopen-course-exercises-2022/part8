import React from 'react'
import { useQuery } from '@apollo/client'
import { GET_ALL_BOOKS } from '../queries'

const Books = ({ show }) => {
  const results = useQuery(GET_ALL_BOOKS)
  if (!show) {
    return null
  }
  const books = results?.data?.getBooks
  console.log(books)
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
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
