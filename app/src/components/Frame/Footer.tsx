import React from 'react';

import styled from 'styled-components';

import { mediaQuery, size } from 'src/breakpoints';
import { THEME_COLORS } from 'src/utils/ui/theme';

import { BeanstalkLogoBlack, Discord, Github, Twitter } from '../Icons';

export const Footer = () => (
  <Container>
    <Box href='https://docs.pinto.exchange' rel='noopener noreferrer' target='_blank'>
      <InfoText>
        <span role='img' aria-label='Documentation'>
          📃 Protocol Documentation
        </span>
      </InfoText>
      <StyledLink>Visit the Docs →</StyledLink>
    </Box>
    <SmallBox href='https://pinto.exchange/discord' rel='noopener noreferrer' target='_blank'>
      <Discord width={20} />
    </SmallBox>
    <SmallBox href='https://twitter.com/pintoexchange' rel='noopener noreferrer' target='_blank'>
      <Twitter width={20} />
    </SmallBox>
    <SmallBox href='https://github.com/pintomoney/exchange-interface' rel='noopener noreferrer' target='_blank'>
      <Github width={20} />
    </SmallBox>
    <SmallBox href='https://app.pinto.money' rel='noopener noreferrer' target='_blank'>
      {/* FIX ME */}
      <BeanstalkLogoBlack width={20} />
    </SmallBox>
  </Container>
);

const Container = styled.footer`
  display: none;
  flex-direction: row;
  box-sizing: border-box;
  border: 1px solid black;
  height: 56px;
  min-height: 56px;
  width: 100vw;
  align-items: stretch;
  @media (min-width: ${size.mobile}) {
    display: flex;
    height: 72px;
    min-height: 72px;
  }
`;

const Box = styled.a`
  display: flex;
  flex: 2;
  border-left: 1px solid black;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: black;
  gap: 16px;
  :hover {
    background-color: ${THEME_COLORS.primaryLight};
  }
  :first-child {
    border-left: none;
  }

  ${mediaQuery.md.only} {
    flex-wrap: wrap;
    gap: 8px;
    flex-flow: column;
  }
`;

const InfoText = styled.div`
  whitespace: nowrap;
`;

const SmallBox = styled.a`
  display: flex;
  width: 64px;
  border-left: 1px solid black;
  justify-content: center;
  align-items: center;
  :hover {
    background-color: ${THEME_COLORS.primaryLight};
  }
`;

const StyledLink = styled.span`
  text-decoration: underline;
  white-space: nowrap;
`;
