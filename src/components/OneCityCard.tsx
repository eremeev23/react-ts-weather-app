import React, { FC } from 'react';
import styled from 'styled-components';
import { WeatherData } from '../types/data';
import WindIcon from './icons/WindIcon';
import SettingsIcon from './icons/SettingsIcon';
import { OPEN_SETTINGS } from '../store/reducers/citiesSlice';
import { useAppDispatch } from '../hooks/redux';

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px;
  width: 100%;
  max-width: 380px;
  background: linear-gradient(315deg, #1e2127, #23282e);
  box-shadow: -5px -5px 35px #16181c, 5px 5px 35px #282d33;
  border-radius: 50px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const CardBody = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CityName = styled.p`
  font-size: 18px;
  font-weight: 600;
`;

const SettingsButton = styled.button``;

const WeatherIcon = styled.img`
  width: 80px;
  height: 80px;
`;

const WeatherTemp = styled.span`
  font-size: 42px;
  font-weight: 500;
`;

const CardFeelsLike = styled.p``;

const CardInfo = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 15px 10px;
`;

const CardInfoBlock = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin-right: 5px;
    width: 20px;
    height: 20px;
  }
`;

const CardInfoBlockText = styled.span``;

const OneCityCard: FC<WeatherData> = (cityData) => {
  const dispatch = useAppDispatch();
  const openSettings = () => dispatch(OPEN_SETTINGS());
  const windDirections = (): string => {
    let direction = '';

    switch (true) {
      case cityData.windDegs > 0 && cityData.windDegs < 90:
        return (direction = 'NNE');
      case cityData.windDegs > 90 && cityData.windDegs < 180:
        return (direction = 'SSE');
      case cityData.windDegs > 180 && cityData.windDegs < 270:
        return (direction = 'SSW');
      case cityData.windDegs > 270 && cityData.windDegs < 360:
        return (direction = 'NNW');
      case cityData.windDegs === 0:
        return (direction = 'N');
      case cityData.windDegs === 90:
        return (direction = 'E');
      case cityData.windDegs === 180:
        return (direction = 'S');
      case cityData.windDegs === 270:
        return (direction = 'W');
      default:
        return '';
    }
  };

  const weatherDescription: string =
    cityData.description.charAt(0).toUpperCase() +
    cityData.description.substr(1);

  return (
    <CardWrapper>
      <CardHeader>
        <CityName>
          {cityData.city}, {cityData.cityCountry}
        </CityName>

        <SettingsButton onClick={openSettings}>
          <SettingsIcon />
        </SettingsButton>
      </CardHeader>
      <CardBody>
        <WeatherIcon
          src={`https://openweathermap.org/img/wn/${cityData.icon}@2x.png`}
        />
        <WeatherTemp>{cityData.temp}°C</WeatherTemp>
      </CardBody>
      <CardFeelsLike>
        Feels like {cityData.feels_like}°C. {weatherDescription}.
      </CardFeelsLike>

      <CardInfo>
        <CardInfoBlock>
          <WindIcon />
          <CardInfoBlockText>
            {cityData.wind}, {windDirections()}
          </CardInfoBlockText>
        </CardInfoBlock>
        <CardInfoBlock>
          <CardInfoBlockText>{cityData.pressure} hPa</CardInfoBlockText>
        </CardInfoBlock>
        <CardInfoBlock>
          <CardInfoBlockText>Humidity: {cityData.humidity}%</CardInfoBlockText>
        </CardInfoBlock>
        <CardInfoBlock>
          <CardInfoBlockText>Dew point: 0°C</CardInfoBlockText>
        </CardInfoBlock>
        <CardInfoBlock>
          <CardInfoBlockText>
            Visibility: {cityData.visibility}
          </CardInfoBlockText>
        </CardInfoBlock>
      </CardInfo>
    </CardWrapper>
  );
};

export default OneCityCard;
