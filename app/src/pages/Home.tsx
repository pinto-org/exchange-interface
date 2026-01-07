/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';

import styled from 'styled-components';
import { useChainId } from 'wagmi';

import { mediaQuery } from 'src/breakpoints';
import { ContractInfoMarquee } from 'src/components/Frame/ContractInfoMarquee';
import { THEME_COLORS } from 'src/utils/ui/theme';

const copy = {
  build: 'Use DEX components written, audited and deployed by other developers for your custom liquidity pool.',
  deploy: 'Deploy liquidity in pools with unique pricing functions for more granular market making.',
  fees: "Exchange assets in liquidity pools that don't impose trading fees."
};

const links = {
  multiFlowPump: '/multi-flow-pump.pdf',
  whitepaper: '/pinto-exchange.pdf',
  docs: 'https://pinto-exchange.gitbook.io/',
  wells: '/#/wells',
  swap: '/#/swap',
  build: '/#/build'
};

export const Home = () => {
  const chainid = useChainId();
  return (
    <>
      <Container>
        <Content>
          <InfoContainer>
            <TitleSubtitleContainer>
              <Title>A Composable EVM-Native DEX </Title>
              <SubTitle>
                Customizable liquidity pools with shared components.&nbsp;
                <WhitepaperLink href={links.whitepaper} target='_blank'>
                  Read the whitepaper →
                </WhitepaperLink>
              </SubTitle>
            </TitleSubtitleContainer>
            <AccordionContainer>
              <AccordionItem
              // href={links.build}
              >
                <AccordionTitle>
                  <Emoji role='img' aria-label='crystal ball'>
                    🔮
                  </Emoji>
                  &nbsp;Build using components
                </AccordionTitle>
                <AccordionContent>{copy.build}</AccordionContent>
              </AccordionItem>
              <AccordionItem href={`${links.wells}/${chainid}`}>
                <AccordionTitle>
                  <div>
                    <Emoji role='img' aria-label='lightning'>
                      ⚡️
                    </Emoji>
                    &nbsp;Deploy flexible liquidity
                  </div>
                </AccordionTitle>
                <AccordionContent>{copy.deploy}</AccordionContent>
              </AccordionItem>
              <AccordionItem href={links.swap}>
                <AccordionTitle>
                  <div>
                    <Emoji role='img' aria-label='heart'>
                      ❤️
                    </Emoji>
                    &nbsp;Zero-fee swaps
                  </div>
                </AccordionTitle>
                <AccordionContent>{copy.fees}</AccordionContent>
              </AccordionItem>
            </AccordionContainer>
          </InfoContainer>
          <MarqueeContainer>
            <ContractInfoMarquee />
          </MarqueeContainer>
        </Content>
      </Container>
    </>
  );
};

const MarqueeContainer = styled.div`
  position: fixed;
  bottom: 72px;

  ${mediaQuery.sm.only} {
    position: fixed;
    left: 0;
    bottom: 0;
  }
`;

const Container = styled.div`
  height: calc(100% - 24px);
  padding-top: 12px;
  padding-left: 12px;
  padding-right: 12px;
  padding-bottom: 0px;

  ${mediaQuery.sm.up} {
    padding-top: 32px;
    padding-left: 48px;
    padding-right: 48px;

    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  ${mediaQuery.sm.up} {
    justify-content: space-between;
    align-items: center;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
  height: 100%;

  ${mediaQuery.sm.up} {
    padding-top: min(25%, 250px);
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    gap: 72px;
  }
`;

const TitleSubtitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${mediaQuery.sm.up} {
    align-items: center;
    gap: 48px;
  }
`;

const Title = styled.div`
  font-size: 32px;
  font-weight: 600;
  line-height: 40px;
  ${mediaQuery.sm.up} {
    font-style: normal;
    font-size: 72px;
    line-height: 100%;
    text-align: center;
  }
`;

const SubTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #4b5563;
  gap: 8px;
  ${mediaQuery.sm.up} {
    flex-direction: row;
    font-size: 20px;
    line-height: 24px;
    align-items: center;
    justify-content: center;
    gap: 0px;
  }
`;

const WhitepaperLink = styled.a`
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
  color: ${THEME_COLORS.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  white-space: nowrap;
  margin-left: 4px;

  :hover {
    text-decoration: underline;
  }

  ${mediaQuery.sm.up} {
    font-size: 20px;
    line-height: 24px;
  }
`;

const AccordionContainer = styled.div`
  /// Desktop
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  width: 100%;

  ${mediaQuery.sm.up} {
    padding-bottom: 150px;
  }

  /// Tablet
  ${mediaQuery.md.only} {
    width: 100%;
    flex-direction: column;
    gap: 12px;
  }

  /// Mobile
  ${mediaQuery.sm.only} {
    flex-direction: column;
    position: relative;
    bottom: calc(57px + 12px); // 57px is the height of the contract info marquee
    gap: 12px;
    justify-content: space-around;
    position: fixed;
    width: calc(100vw - 24px);
  }
`;

const Emoji = styled.span`
  margin-right: 4px;
`;

const AccordionItem = styled.a`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
  color: #444;
  cursor: pointer;
  padding: 24px;
  border: 0.5px solid #4b5563;
  outline: 1.5px solid white;
  text-align: left;
  width: 33%;
  transition: background-color 0.3s ease;
  overflow: hidden;
  max-height: 113px; // Initial max-height
  box-sizing: border-box;
  text-decoration: none;

  &:hover {
    border: 1.5px solid ${THEME_COLORS.primary};
    background-color: ${THEME_COLORS.primaryLight};
    outline: 0.5px solid transparent;
    max-height: 250px; // Adjust as needed for your content
  }

  ${mediaQuery.md.up} {
    padding: 24px;
    height: 100%;
  }

  ${mediaQuery.md.only} {
    width: calc(100vw - 86px);
    height: auto;
    :last-child {
      margin-bottom: 24px;
    }
  }

  ${mediaQuery.sm.only} {
    width: calc(100vw - 24px);
    max-height: 80px;
    padding: 12px;
  }
`;

const AccordionContent = styled.div`
  overflow: hidden;
  opacity: 0; // Initially hidden
  transition:
    opacity 0.3s ease-out,
    max-height 0.3s ease-out;
  max-height: 0;
  width: 100%; // Ensure it takes full width

  ${AccordionItem}:hover & {
    padding-top: 12px;
    opacity: 1;
    max-height: 200px; // Adjust as needed for your content
  }

  ${mediaQuery.sm.only} {
    display: none;
  }
`;

const AccordionTitle = styled.div`
  text-align: center;
  width: 100%;
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;

  ${mediaQuery.md.only} {
    font-size: 20px;
    line-height: 24px;
  }

  ${mediaQuery.sm.only} {
    font-size: 14px;
    line-height: 22px;
  }
`;
