import React, { FC, useState } from 'react';
import styled from 'styled-components';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import CloseIcon from './icons/CloseIcon';
import AddIcon from './icons/AddIcon';
import {
  DELETE_CITY,
  fetchWeatherData,
  OPEN_SETTINGS,
  REPLACE_CITIES,
} from '../store/reducers/citiesSlice';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { WeatherData } from '../types/data';
import TrashIcon from './icons/TrashIcon';
import axios from 'axios';

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px;
  width: 100%;
  max-width: 380px;
  background: linear-gradient(315deg, #1e2127, #23282e);
  box-shadow: -5px -5px 35px #1f2228, 5px 5px 35px #252a2f;
  border-radius: 50px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SettingsTitle = styled.p`
  font-size: 18px;
  font-weight: 600;
`;

const CloseButton = styled.button``;

const DragWrapper = styled.div`
  display: flex;
  margin: 20px 0 60px;
  flex-direction: column;
  gap: 5px;
`;

const CityWrapper = styled.div`
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  background-color: #2c313c;
  border-radius: 8px;
`;

const CityWrapperLeft = styled.div`
  display: flex;
  align-items: center;
  color: #dcd7c9;
`;

const DragButton = styled.div`
  margin-right: 15px;
  display: flex;
  align-items: center;
  height: 20px;
  cursor: grab;
`;

const DragButtonLine = styled.span`
  position: relative;
  display: inline-block;
  width: 16px;
  height: 1.5px;
  background-color: #dcd7c9;

  &::before,
  &::after {
    cursor: grab;
    position: absolute;
    content: '';
    width: 16px;
    height: 1.5px;
    left: 0;
    background-color: #dcd7c9;
  }

  &::before {
    top: -5px;
  }

  &::after {
    top: 5px;
  }
`;

const DeleteCityButton = styled.button`
  padding: 0;
  display: flex;
  justify-content: flex-end;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const SettingsFormWrapper = styled.div``;

const SettingsForm = styled.form`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SettingsFormTitle = styled.p`
  margin-bottom: 10px;
  font-weight: 600;
  color: #dcd7c9;
`;

const SettingsInput = styled.input`
  outline: none;
  width: 100%;
  padding: 12px;
  font-size: 16px;
  height: 100%;
  color: #dcd7c9;
  background-color: #3d4956;
  border: none;
  border-radius: 8px;

  &.error {
    border-color: #ff3333;
  }

  &::placeholder {
    color: rgba(220, 215, 201, 0.35);
  }
`;

const ErrorMessage = styled.p`
  position: absolute;
  bottom: -16px;
  left: 5px;
  color: #f45b69;
  font-size: 11px;
  font-weight: 500;
`;

const SettingsFormSubmit = styled.button`
  position: absolute;
  right: 5px;
  padding: 5px 0 3px;
  width: 40px;

  svg {
    height: 20px;
    width: 20px;
  }
`;

const SettingsCard: FC = () => {
  const cities: WeatherData[] = useAppSelector(
    (state) => state.citiesReducer.cities
  );
  const dispatch = useAppDispatch();
  const openSettings = () => dispatch(OPEN_SETTINGS());
  const replaceCities = (list: WeatherData[]) => dispatch(REPLACE_CITIES(list));

  const [newCity, setNewCity] = useState('');
  const [error, setError] = useState(false);

  const isCitiesLength = () => {
    if (cities.length) {
      return (
        <CloseButton onClick={openSettings}>
          <CloseIcon />
        </CloseButton>
      );
    } else {
      return <></>;
    }
  };

  const reorder = (
    list: WeatherData[],
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      cities,
      result.source.index,
      result.destination.index
    );

    replaceCities(items);
  };

  const deleteCity = (index: number) => {
    dispatch(DELETE_CITY(index));
  };

  const isError = () => {
    if (!error) {
      return <></>;
    } else {
      return <ErrorMessage>Type city</ErrorMessage>;
    }
  };

  const submitCityForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newCity.trim().length) {
      setError(false);
      axios
        .get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${newCity}&appid=924bdba454482fce947584b28d955c30`
        )
        .then((response) => {
          dispatch(
            fetchWeatherData({
              lat: response.data[0].lat,
              lon: response.data[0].lon,
            })
          );
        })
        .then(() => setNewCity(''))
        .catch((err) => console.log(err));
    } else {
      setError(true);
    }
  };

  return (
    <CardWrapper>
      <CardHeader>
        <SettingsTitle>Settings</SettingsTitle>
        {isCitiesLength()}
      </CardHeader>
      <DragDropContext onDragEnd={(e) => onDragEnd(e)}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <DragWrapper {...provided.droppableProps} ref={provided.innerRef}>
              {cities.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <CityWrapper
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <CityWrapperLeft>
                        <DragButton onClick={(e) => e.stopPropagation()}>
                          <DragButtonLine></DragButtonLine>
                        </DragButton>
                        {item.city}
                      </CityWrapperLeft>

                      <DeleteCityButton onClick={() => deleteCity(index)}>
                        <TrashIcon />
                      </DeleteCityButton>
                    </CityWrapper>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </DragWrapper>
          )}
        </Droppable>
      </DragDropContext>
      <SettingsFormWrapper>
        <SettingsFormTitle>Add location:</SettingsFormTitle>
        <SettingsForm onSubmit={(e) => submitCityForm(e)}>
          <SettingsInput
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            onFocus={() => setError(false)}
            placeholder={'City'}
          />
          {isError()}
          <SettingsFormSubmit>
            <AddIcon />
          </SettingsFormSubmit>
        </SettingsForm>
      </SettingsFormWrapper>
    </CardWrapper>
  );
};

export default SettingsCard;
