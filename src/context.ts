export interface Context {
  currentUser: {
    id: string
    role: 'user' | 'admin'
  } | null
}
