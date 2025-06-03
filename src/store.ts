import { create } from 'zustand'

interface User {
  username?: string;
  email?: string
  phone?: string
  isVerified?: boolean
}

type State = {
  user: User
}

type Actions = {
  setUser: (user: User) => void
  deleteUser: () => void
}

const useUserStore = create<State & Actions>((set) => ({
  user: {},

  setUser: (userData: User) =>
    set(() => ({
      user: userData,
    })),

  deleteUser: () =>
    set(() => ({
      user: {},
    })),
}))

export default useUserStore;