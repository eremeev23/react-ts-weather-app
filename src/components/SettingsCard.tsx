import React, { FC } from 'react';
import styled from 'styled-components';

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px;
  width: 100%;
  max-width: 380px;
  background: linear-gradient(315deg, #1e2127, #23282e);
  box-shadow: -5px -5px 25px #16181c, 5px 5px 25px #31383f;
  border-radius: 50px;
`;

const SettingsCard: FC = () => {
  return <CardWrapper></CardWrapper>;
};

export default SettingsCard;
