import { gql } from '@apollo/client'

export const GET_ALL_AUTHORS = gql`
  query {
    getAuthors {
      name
      born
      id
    }
  }
`

export const GET_ALL_BOOKS = gql`
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

export const CREATE_BOOK = gql`
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

export const UPDATE_AUTHOR = gql`
  mutation editBorn($name: String!, $born: Int!) {
    editBorn(name: $name, born: $born) {
      name,
      born
    }
  }
`