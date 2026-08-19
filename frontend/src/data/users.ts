export type User = {
  id: string
  username: string
  password: string
}

export const initialUsers: User[] = [
  {
    id: 'user-admin',
    username: 'admin',
    password: 'admin123',
  },
]
