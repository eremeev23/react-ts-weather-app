import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CitiesState, Coords } from '../../types/data';
import axios from 'axios';

// Checking an existing of local cities list
const localCitiesList: string | null = window.localStorage.getItem('weather_cities');

const initialState: CitiesState = {
  cities: localCitiesList ? JSON.parse(localCitiesList) : [],
  loading: false,
  error: '',
  settingsOpened: false
};

export const fetchWeatherData = createAsyncThunk(
  'cities/fetchWeatherData',
  (coords: Coords) => {
    return axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=924bdba454482fce947584b28d955c30`
      )
      .then((response) => response.data);
  }
);

const citiesSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    OPEN_SETTINGS(state) {
      state.settingsOpened = !state.settingsOpened
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWeatherData.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchWeatherData.fulfilled, (state, action) => {
      state.loading = false;
      state.cities.push({
        id: new Date().toISOString(),
        temp: Math.ceil(action.payload.main.temp - 273.15),
        feels_like: Math.ceil(action.payload.main.feels_like - 273.15),
        icon: action.payload.weather[0].icon,
        iconDesc: action.payload.weather[0].main,
        humidity: action.payload.main.humidity,
        pressure: action.payload.main.pressure,
        visibility: (action.payload.visibility / 1000).toFixed(1) + 'km',
        description: action.payload.weather[0].description,
        wind: action.payload.wind.speed.toFixed(1) + 'm/s',
        windDegs: action.payload.wind.deg,
        city: action.payload.name,
        cityCountry: action.payload.sys.country,
      });
// Saving cities list to the local storage
      window.localStorage.setItem('weather_cities', JSON.stringify(state.cities))
      state.error = '';
    });

    builder.addCase(fetchWeatherData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message
        ? action.error.message
        : 'No weather info';
    });
  },
});

export const { OPEN_SETTINGS } = citiesSlice.actions;

export default citiesSlice.reducer;
