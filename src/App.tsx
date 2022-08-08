import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import { fetchWeatherData } from './store/reducers/citiesSlice';
import { WeatherData } from './types/data';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import OneCityCard from './components/OneCityCard';
import SettingsCard from "./components/SettingsCard";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const App: FC = () => {
  const dispatch = useAppDispatch();
  const cities = useAppSelector((state) => state.citiesReducer.cities);
  const settingsOpened = useAppSelector((state) => state.citiesReducer.settingsOpened);
  const geo = navigator.geolocation;
// Loading our cities list from loc.storage or api
  useEffect(() => {
    if (!cities.length) {
      geo.getCurrentPosition((pos) => {
        dispatch(
          fetchWeatherData({
            lat: pos.coords.latitude.toString(),
            lon: pos.coords.longitude.toString(),
          })
        );
      });
    }
  }, []);

  const isSettingsOpened = () => {
    if (settingsOpened) {
      return <SettingsCard />
    } else {
      return (
        <>
          {cities.map((cityData: WeatherData) => {
            return <OneCityCard key={cityData.id} {...cityData} />;
          })}
        </>
      )
    }
  }

  return (
    <Container>
      { isSettingsOpened() }
    </Container>
  );
};

export default App;
