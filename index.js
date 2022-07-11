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
    createTodoItem: (parent, { value, status }) => {
      const newTodoItem = {
        id: nanoid(),
        value: value,
        status: status,
      }
      todoItems.push(newTodoItem)
      return newTodoItem
    },
    updateTodoItem: (parent, { id, status }) => {
      const updatedTodoItem = todoItems.find((item) => item.id === id)
      updatedTodoItem.status = status
      return updatedTodoItem
    },
    deleteTodoItem: (parent, { id }) => {
      const deletedTodoItemIndex = todoItems.findIndex((item) => item.id === id)
      const deletedTodoItemCopy = { ...todoItems[deletedTodoItemIndex] }
      todoItems.splice(deletedTodoItemIndex, 1)
      return deletedTodoItemCopy
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
