import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://671b8cba2c842d92c3806828.mockapi.io/api/v1/users';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

export const addUser = createAsyncThunk('users/addUser', async (user) => {
  const response = await axios.post(API_URL, user, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
});

export const updateUser = createAsyncThunk('users/updateUser', async ({ id, updatedUser }) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedUser, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    currentUser: null,
  },
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        state.users[index] = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      });
  },
});

export const { setCurrentUser } = usersSlice.actions;
export default usersSlice.reducer;