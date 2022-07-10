import { ApolloServer, gql } from 'apollo-server'
import { nanoid } from 'nanoid'

const typeDefs = gql`
  enum TodoItemStatus {
    IN_PROGRESS
    DONE
  }

  type TodoItem {
    id: String
    value: String
    status: TodoItemStatus
  }

  type Query {
    items: [TodoItem]
  }

  type Mutation {
    createTodoItem(value: String!, status: TodoItemStatus!): TodoItem
    updateTodoItem(id: String!, status: TodoItemStatus!): TodoItem
    deleteTodoItem(id: String!): TodoItem
  }
`

const todoItems = [
  {
    id: nanoid(),
    value: 'Test todo item 1',
    status: 'IN_PROGRESS',
  },
  {
    id: nanoid(),
    value: 'Test todo item 2',
    status: 'DONE',
  },
]

const resolvers = {
  Query: {
    items: () => todoItems,
  },
  Mutation: {
    createTodoItem: (value, status) => {
      const newTodoItem = {
        id: nanoid(),
        value: value,
        status: status,
      }
      todoItems.push(newTodoItem)
      return newTodoItem
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: 'bounded',
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
