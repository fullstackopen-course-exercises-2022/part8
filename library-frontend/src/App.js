import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { gql, useQuery, useMutation } from '@apollo/client'
import { GET_ALL_AUTHORS } from './queries'

const GET_ALL_BOOKS = gql`
  query {
    getBooks {
      title
      published
      author
      id
      genres
    }
  }
`

// const GET_ALL_AUTHORS = gql`
//   query {
//     getAuthors {
//       name
//       id
//     }
//   }
// `

const CREATE_BOOK = gql`
  mutation createBooks($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    createBooks(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title,
      published,
      genres,
      author {
        name
      }
    }
  }
`

const UPDATE_AUTHOR = gql`
  mutation editBorn($name: String!, $born: Int!) {
    editBorn(name: $name, born: $born) {
      name,
      born
    } 
  } 
`

const App = () => {
  const [page, setPage] = useState('authors')
  const results = useQuery(GET_ALL_BOOKS)
  const [ createBooks ] = useMutation(CREATE_BOOK)
  const [ editBorn ] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: GET_ALL_AUTHORS }]
  })
  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors show={page === 'authors'} editBorn={editBorn} />

      <Books show={page === 'books'} data={results?.data?.getBooks} />

      <NewBook show={page === 'add'} createBooks={createBooks} />
    </div>
  )
}

export default App
