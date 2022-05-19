import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { gql, useQuery, useMutation } from '@apollo/client'
import { GET_ALL_AUTHORS, GET_ALL_BOOKS, CREATE_BOOK, UPDATE_AUTHOR } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')

  const [ createBooks ] = useMutation(CREATE_BOOK, {
    refetchQueries: { query: GET_ALL_BOOKS },
    onError: error => {}
  })
  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} createBooks={createBooks} />
    </div>
  )
}

export default App
