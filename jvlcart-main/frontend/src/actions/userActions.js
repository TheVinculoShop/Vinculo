import {
    loginFail,
    loginRequest,
    loginSuccess,
    clearError,
    registerFail,
    registerRequest,
    registerSuccess,
    loadUserRequest,
    loadUserSuccess,
    loadUserFail,
    logoutSuccess,
    logoutFail,
    updateProfileRequest,
    updateProfileSuccess,
    updateProfileFail,
    updatePasswordRequest,
    updatePasswordSuccess,
    updatePasswordFail,
    forgotPasswordRequest,
    forgotPasswordSuccess,
    forgotPasswordFail,
    resetPasswordRequest,
    resetPasswordSuccess,
    resetPasswordFail
} from '../slices/authSlice';

import {
    usersRequest,
    usersSuccess,
    usersFail,
    userRequest,
    userSuccess,
    userFail,
    deleteUserRequest,
    deleteUserSuccess,
    deleteUserFail,
    updateUserRequest,
    updateUserSuccess,
    updateUserFail
} from '../slices/userSlice';

import axios from 'axios';

// Helper function to get token
const getToken = () => localStorage.getItem('token');

export const loginWithGoogle = (credential) => async (dispatch) => {
    try {
        dispatch(loginRequest());
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const { data } = await axios.post('/api/v1/google-login', { tokenId: credential }, config);
        dispatch(loginSuccess(data));
        localStorage.setItem('token', data.token); // Save token
    } catch (error) {
        dispatch(loginFail(error.response?.data?.message || 'Google login failed'));
    }
};

// Login User
export const login = (email, password) => async (dispatch) => {
    try {
        dispatch(loginRequest());
        const { data } = await axios.post('/api/v1/login', { email, password });
        dispatch(loginSuccess(data));
        localStorage.setItem('token', data.token); // Save token
    } catch (error) {
        dispatch(loginFail(error.response?.data?.message || 'Login failed'));
    }
};

// Clear Authentication Errors
export const clearAuthError = () => (dispatch) => {
    dispatch(clearError());
};

// Register User
export const register = (userData) => async (dispatch) => {
    try {
        dispatch(registerRequest());
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        const { data } = await axios.post('/api/v1/register', userData, config);
        dispatch(registerSuccess(data));
        localStorage.setItem('token', data.token); // Save token
    } catch (error) {
        dispatch(registerFail(error.response?.data?.message || 'Registration failed'));
    }
};

// Load User
export const loadUser = () => async (dispatch) => {
    try {
        dispatch(loadUserRequest());
        const token = getToken();
        if (!token) throw new Error('No token found, please login first.');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const { data } = await axios.get('/api/v1/myprofile', config);
        dispatch(loadUserSuccess(data));
        
    } catch (error) {
        dispatch(loadUserFail(error.response?.data?.message || 'Failed to load user data'));
    }
};

// Logout User
export const logout = () => async (dispatch) => {
    try {
        await axios.get('/api/v1/logout');
        dispatch(logoutSuccess());
        localStorage.removeItem('token'); // Remove token on logout
    } catch (error) {
        dispatch(logoutFail(error.response?.data?.message || 'Logout failed'));
    }
};

// Update Profile
export const updateProfile = (userData) => async (dispatch) => {
    try {
        dispatch(updateProfileRequest());
        const token = getToken();
        if (!token) throw new Error('No token found, please login first.');
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        };
        const { data } = await axios.put('/api/v1/update', userData, config);
        dispatch(updateProfileSuccess(data));
        
    } catch (error) {
        dispatch(updateProfileFail(error.response?.data?.message || 'Profile update failed'));
    }
};

// Update Password
export const updatePassword = (formData) => async (dispatch) => {
    try {
        dispatch(updatePasswordRequest());
        const token = getToken();
        if (!token) throw new Error('No token found, please login first.');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        await axios.put('/api/v1/password/change', formData, config);
        dispatch(updatePasswordSuccess());
    } catch (error) {
        dispatch(updatePasswordFail(error.response?.data?.message || 'Password update failed'));
    }
};

// Forgot Password
export const forgotPassword = (formData) => async (dispatch) => {
    try {
        dispatch(forgotPasswordRequest());
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const { data } = await axios.post('/api/v1/password/forgot', formData, config);
        dispatch(forgotPasswordSuccess(data));
    } catch (error) {
        dispatch(forgotPasswordFail(error.response?.data?.message || 'Failed to send reset email'));
    }
};

// Reset Password
export const resetPassword = (formData, token) => async (dispatch) => {
    try {
        dispatch(resetPasswordRequest());
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const { data } = await axios.post(`/api/v1/password/reset/${token}`, formData, config);
        dispatch(resetPasswordSuccess(data));
    } catch (error) {
        dispatch(resetPasswordFail(error.response?.data?.message || 'Password reset failed'));
    }
};

// Get All Users (Admin)
export const getUsers = () => async (dispatch) => {
    try {
        dispatch(usersRequest());
        const token = getToken();
        if (!token) throw new Error('No token found, please login first.');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const { data } = await axios.get('/api/v1/admin/users', config);
        dispatch(usersSuccess(data));
    } catch (error) {
        dispatch(usersFail(error.response?.data?.message || 'Failed to load users'));
    }
};

// Get User Details (Admin)
export const getUser = (id) => async (dispatch) => {
    try {
        dispatch(userRequest());
        const token = getToken();
        if (!token) throw new Error('No token found, please login first.');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const { data } = await axios.get(`/api/v1/admin/user/${id}`, config);
        dispatch(userSuccess(data));
    } catch (error) {
        dispatch(userFail(error.response?.data?.message || 'Failed to load user details'));
    }
};

// Delete User (Admin)
export const deleteUser = (id) => async (dispatch) => {
    try {
        dispatch(deleteUserRequest());
        const token = getToken();
        if (!token) throw new Error('No token found, please login first.');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        await axios.delete(`/api/v1/admin/user/${id}`, config);
        dispatch(deleteUserSuccess());
    } catch (error) {
        dispatch(deleteUserFail(error.response?.data?.message || 'Failed to delete user'));
    }
};

// Update User Role (Admin)
export const updateUser = (id, formData) => async (dispatch) => {
    try {
        dispatch(updateUserRequest());
        const token = getToken();
        if (!token) throw new Error('No token found, please login first.');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        await axios.put(`/api/v1/admin/user/${id}`, formData, config);
        dispatch(updateUserSuccess());
       
    } catch (error) {
        dispatch(updateUserFail(error.response?.data?.message || 'Failed to update user'));
    }
};
