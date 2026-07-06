import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  users: [],       // Array to hold registered users
  currentUser: null, // Tracks the currently logged-in user

  // Register a new user
  signUp: (userData) => {
    const { users } = get();
    const userExists = users.some((u) => u.email === userData.email);
    
    if (userExists) {
      throw new Error("User with this email already exists.");
    }

    set((state) => ({
      users: [...state.users, userData],
      currentUser: userData, // Automatically log them in
    }));
  },

  // Sign in an existing user
  signIn: (email, password) => {
    const { users } = get();
    const foundUser = users.find((u) => u.email === email && u.password === password);

    if (!foundUser) {
      throw new Error("Invalid email or password.");
    }

    set({ currentUser: foundUser });
  },

  // Log out
  logout: () => set({ currentUser: null }),
}));