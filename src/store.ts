import { create } from 'zustand'

interface User {
  username?: string;
  email?: string
  phone?: string
  isVerified?: boolean
}

interface AppState {
  user: User
  isLoading: boolean
}

type Actions = {
  setUser: (user: User) => void
  deleteUser: () => void
  setLoading: (loading: boolean) => void
}

const useAppStore = create<AppState & Actions>((set) => ({
  user: {},
  isLoading: false,

  setUser: (userData: User) =>
    set(() => ({
      user: userData,
    })),

  deleteUser: () =>
    set(() => ({
      user: {},
    })),

  setLoading: (loading: boolean) =>
    set(() => ({
      isLoading: loading,
    })),
}))

export default useAppStore;