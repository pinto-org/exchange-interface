import React from "react";

import { useLocation } from "react-router-dom";
import styled from "styled-components";

import { mediaQuery, size } from "src/breakpoints";
import { THEME_COLORS } from "src/utils/ui/theme";

import { Discord, Github, PintoLogoBlack, Twitter } from "../Icons";

export const Footer = () => {
	const location = useLocation();
	const isHomePage = location.pathname === "/";

	return (
		<Container>
			<Box
				href="https://pinto-exchange.gitbook.io/"
				rel="noopener noreferrer"
				target="_blank"
			>
				<InfoText>
					<span role="img" aria-label="Documentation">
						📃 Protocol Documentation
					</span>
				</InfoText>
				<StyledLink>Visit the Docs →</StyledLink>
			</Box>
			<SmallBox
				href="https://pinto.money/discord"
				rel="noopener noreferrer"
				target="_blank"
			>
				<Discord width={20} />
			</SmallBox>
		<SmallBox
			href="https://x.com/pintocommunity"
			rel="noopener noreferrer"
			target="_blank"
		>
			<Twitter width={20} />
		</SmallBox>
		<SmallBox
			href="https://github.com/pinto-org/exchange"
			rel="noopener noreferrer"
			target="_blank"
		>
			<Github width={20} />
		</SmallBox>
		<SmallBox
			href="https://pinto.money"
			rel="noopener noreferrer"
			target="_blank"
		>
			<PintoLogoBlack width={20} />
		</SmallBox>
		{isHomePage && (
			<NetlifyBadgeBox
				href="https://www.netlify.com"
				rel="noopener noreferrer"
				target="_blank"
			>
				<img src="https://www.netlify.com/assets/badges/netlify-badge-color-bg.svg" alt="Deploys by Netlify" />
			</NetlifyBadgeBox>
		)}
	</Container>
	);
};

const Container = styled.footer`
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  border: 1px solid black;
  height: 56px;
  min-height: 56px;
  width: 100vw;
  align-items: stretch;
  @media (min-width: ${size.mobile}) {
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

const NetlifyBadgeBox = styled.a`
  display: flex;
  width: auto;
  min-width: 120px;
  padding: 0 12px;
  border-left: 1px solid black;
  justify-content: center;
  align-items: center;
  :hover {
    background-color: ${THEME_COLORS.primaryLight};
  }

  img {
    display: block;
    width: auto;
    height: auto;
    max-height: 100%;
  }
`;
