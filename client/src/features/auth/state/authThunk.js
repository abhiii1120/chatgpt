import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../service/authService";
import { setAccessToken } from "../../../shared/service/httpClient";

function parseError(error){
    return error?.response?.data?.message || "something went wrong"
}

export const register = createAsyncThunk('auth/register', async (payload, {rejectWithValue}) => {
    try {
        const {data} = await authService.register(payload)
        setAccessToken(data.accessToken)
        return data
    } catch (error) {
        return rejectWithValue(parseError(error));
    }
})

export const login = createAsyncThunk('auth/login',async(payload,{rejectWithValue}) => {
    try {
        const {data} = await authService.login(payload);
        setAccessToken(data.accessToken)
        return data
    } catch (error) {
        return rejectWithValue(parseError(error));
    }
})

export const refresh = createAsyncThunk(
    'auth/refresh',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const { data } = await authService.refreshToken()
            setAccessToken(data.accessToken)
            return data
        } catch (error) {
            setAccessToken(null)
            dispatch(clearSessions())
            return rejectWithValue(parseError(error))
        }
    },
)