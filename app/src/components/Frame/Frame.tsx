import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

import buildIcon from 'src/assets/images/navbar/build.svg';
import swapIcon from 'src/assets/images/navbar/swap.svg';
import wellsIcon from 'src/assets/images/navbar/wells.svg';
import { WalletButton } from 'src/components/Wallet';
import { Settings } from 'src/settings';
import { FC } from 'src/types';
import { useSdkChainId } from 'src/utils/chain';
import { theme, THEME_COLORS } from 'src/utils/ui/theme';

import { Footer } from './Footer';
import { TokenMarquee } from './TokenMarquee';
import { Window } from './Window';
import { BurgerMenuIcon, Discord, Github, Logo, Twitter, X, PintoLogoBlack } from '../Icons';
import { Flex } from '../Layout';
import CustomToaster from '../TxnToast/CustomToaster';
import { LinksNav } from '../Typography';

const isNotProd = !Settings.PRODUCTION;

export const Frame: FC<{}> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const resolvedcid = useSdkChainId();

  return (
    <>
      <Container id='frame'>
        {/* Desktop */}
        <Navbar>
          <NavGrid>
            <NavGridItem>
              <Brand>
                <Link to={'/'}>
                  <Logo /> <BrandText>PINTO EXCHANGE</BrandText>
                </Link>
              </Brand>
            </NavGridItem>
            <NavGridItem id='navbar-links'>
              <NavLinksGrid>
                {/* <NavLink className='nav-link-grid-item' to='/build' hovericon={buildIcon}>
                  BUILD
                </NavLink> */}
                <NavLink className='nav-link-grid-item' to={`/wells/${resolvedcid}`} hovericon={wellsIcon}>
                  LIQUIDITY
                </NavLink>
                <NavLink className='nav-link-grid-item' to='/swap' hovericon={swapIcon}>
                  SWAP
                </NavLink>
                {isNotProd && (
                  <NavLink className='nav-link-grid-item' to='/dev'>
                    DEV
                  </NavLink>
                )}
              </NavLinksGrid>
            </NavGridItem>
            <NavGridItem>
              <WalletContainer>
                <WalletButton />
              </WalletContainer>
              <DropdownMenu open={mobileMenuOpen} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X /> : <BurgerMenuIcon />}
              </DropdownMenu>
            </NavGridItem>
          </NavGrid>
        </Navbar>
        <TokenMarquee />
        <Window>
          <CustomToaster />
          <BurgerMenu open={mobileMenuOpen}>
            <MobileNavLinkContainer>
              <MobileNavLink $bold to='/swap' onClick={() => setMobileMenuOpen(false)}>
                Swap
              </MobileNavLink>
              <MobileNavLink $bold to={`/wells/${resolvedcid}`} onClick={() => setMobileMenuOpen(false)}>
                Wells
              </MobileNavLink>
              {/* <MobileNavLink
								$bold
								to="/build"
								onClick={() => setMobileMenuOpen(false)}
							>
								Build
							</MobileNavLink> */}
              {isNotProd && (
                <MobileNavLink $bold to='/dev' onClick={() => setMobileMenuOpen(false)}>
                  Dev
                </MobileNavLink>
              )}
              <MobileLargeNavRow onClick={() => setMobileMenuOpen(false)}>
                <LinkBox href='https://pinto.money/discord' rel='noopener noreferrer' target='_blank'>
                  <Discord width={20} />
                </LinkBox>
                <LinkBox href='https://x.com/pintocommunity' rel='noopener noreferrer' target='_blank'>
                  <Twitter width={20} />
                </LinkBox>
                <LinkBox href='https://github.com/pinto-org/exchange' rel='noopener noreferrer' target='_blank'>
                  <Github width={20} />
                </LinkBox>
                <LinkBox href='https://pinto.money' rel='noopener noreferrer' target='_blank'>
                  <PintoLogoBlack width={20} />
                </LinkBox>
              </MobileLargeNavRow>
              <MobileDocsRow>
                <MobileNavRow
                  href='https://pinto-exchange.gitbook.io/'
                  rel='noopener noreferrer'
                  target='_blank'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Documentation
                </MobileNavRow>
                {/* Disabled until/unless reapplying to open source plan */}
                {/* <MobileNetlifyRow href='https://www.netlify.com' rel='noopener noreferrer' target='_blank' onClick={() => setMobileMenuOpen(false)}>
                  <img src="https://www.netlify.com/assets/badges/netlify-badge-color-bg.svg" alt="Deploys by Netlify" />
                </MobileNetlifyRow> */}
              </MobileDocsRow>
            </MobileNavLinkContainer>
            <MobileConnectContainer>
              <WalletButton />
            </MobileConnectContainer>
          </BurgerMenu>
          {/* TODO Restore this */}
          {/* {chain?.unsupported ? <Title title="Unsupported Chain" /> : children} */}
          {children}
        </Window>
        <Footer />
      </Container>
    </>
  );
};

/// ------------------------------------------------------------------------------------------------

type NavLinkProps = {
  hovericon?: string;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  align-items: center;

  ${theme.media.query.sm.only} {
    width: 100svw;
    height: 100svh;
  }
`;

const Navbar = styled.nav`
  border-bottom: 0.5px solid black;
  display: flex;
  width: 100vw;
  height: 56px;
  min-height: 56px;
  box-sizing: border-box;
  padding: 0px;

  ${theme.media.query.md.up} {
    height: 64px;
    min-height: 64px;
  }
`;

const NavGrid = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr 280px;
  align-items: center;
  height: 100%;
  width: 100%;

  ${theme.media.query.md.down} {
    grid-template-columns: 1fr 1fr;
  }
`;

const NavGridItem = styled(Flex).attrs({
  $direction: 'column',
  $alignSelf: 'stretch',
  $alignItems: 'center',
  $justifyContent: 'center'
})`
  :last-child {
    align-items: flex-end;
  }

  &#navbar-links {
    ${theme.media.query.md.down} {
      display: none;
    }
  }
`;

const Brand = styled(Flex).attrs({
  $direction: 'row',
  $pl: 2,
  $maxWidth: '250px',
  $alignSelf: 'stretch'
})`
  a {
    display: flex;
    gap: 4px;
    align-items: center;
    ${LinksNav}
    text-decoration: none;
    text-transform: uppercase;
    color: #0f172a;

    :focus {
      outline: none;
    }
  }

  ${theme.media.query.md.up} {
    justify-self: flex-start;
    padding-left: ${theme.spacing(6)};
  }
`;

const NavLinksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${isNotProd ? 4 : 3}, minmax(100px, 192px));
  grid-template-rows: 1fr;

  justify-content: center;
  align-self: stretch;
  height: 100%;
`;

const NavLink = styled(Link)<NavLinkProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-left: 0.5px solid black;
  outline: none;

  text-decoration: none;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: black;
  cursor: ${(props) => (props.hovericon ? `url(${props.hovericon}), auto` : 'pointer')};

  :hover {
    background-color: ${THEME_COLORS.primaryLight};
  }

  :last-child {
    border-right: 0.5px solid black;
  }
`;

const WalletContainer = styled(Flex).attrs({
  $direction: 'row',
  $width: '192px',
  $height: '100%'
})`
  box-sizing: border-box;
  border-left: 0.5px solid black;

  :hover {
    background: ${THEME_COLORS.primaryLight};
  }

  :focus {
    outline: none;
  }

  ${theme.media.query.md.down} {
    display: none;
  }
`;

const BrandText = styled.div`
  white-space: nowrap;
  margin-bottom: -4px;
`;

const DropdownMenu = styled.button<{ open?: boolean }>`
  cursor: pointer;
  border: 0px;
  color: #000;
  background: #fff;
  :hover {
    background: #fff;
  }
  :focus {
    outline: #fff;
  }
  height: 100%;
  padding-left: 16px;
  padding-right: 16px;
  font-size: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 9px;
  justify-self: flex-end;

  ${theme.media.query.md.up} {
    display: none;
  }
  div {
    :first-child {
      transition: all 0.3s linear;
      transform-origin: 0% 50%;
      transform: ${({ open }) => (open ? `rotate(45deg)` : `rotate(0)`)};
    }
    :last-child {
      transition: all 0.3s linear;
      transform-origin: 0% 50%;
      transform: ${({ open }) => (open ? `rotate(-45deg)` : `rotate(0)`)};
    }
  }
`;

const BurgerMenu = styled.div<{ open: boolean }>`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 56px);
  width: 100vw;
  justify-content: space-between;
  position: absolute;
  transition: transform 0.3s ease-in-out;
  border-left: 0.5px solid black;
  margin-left: -0.5px;
  transform: ${(props) => (props.open ? `translateX(0%)` : `translateX(100%)`)};
  z-index: 9999;

  ${theme.media.query.md.up} {
    display: none;
  }
`;

const MobileNavLinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const MobileNavLink = styled(Link)<{ $bold?: boolean }>`
  width: 100%;
  border-bottom: 0.5px solid black;
  padding: 16px;
  text-transform: uppercase;
  text-decoration: none;
  color: black;
  font-weight: ${(props) => (props.$bold ? `600` : `normal`)};
  ${(props) => props.$bold && `letter-spacing: 0.96px;`}
`;

const MobileNavRow = styled.a<{ $bold?: boolean }>`
  flex: 5;
  border-right: 0.5px solid black;
  padding: 16px;
  text-transform: uppercase;
  text-decoration: none;
  color: black;
  font-weight: ${(props) => (props.$bold ? `600` : `normal`)};
  ${(props) => props.$bold && `letter-spacing: 0.96px;`}
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MobileLargeNavRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  border-bottom: 0.5px solid black;
  color: black;
`;

const MobileConnectContainer = styled.div`
  display: flex;
  direction: row;
  align-self: stretch;
  justify-content: center;
  border-top: 0.5px solid black;
  height: 52px;

  ${theme.media.query.sm.up} {
    margin-bottom: 120px;
  }
`;

const LinkBox = styled.a`
  display: flex;
  flex: 1;
  padding: 32px;
  border-left: 0.5px solid black;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: black;
  :first-child {
    border-left: none;
  }
`;

const MobileDocsRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  border-bottom: 0.5px solid black;
`;

const MobileNetlifyRow = styled.a`
  flex: 3;
  margin-left: -10px;
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: black;
  -webkit-tap-highlight-color: transparent;
  outline: none;

  &:active,
  &:focus {
    background-color: transparent;
    outline: none;
  }

  img {
    display: block;
    width: auto;
    height: auto;
    max-height: 40px;
  }
`;
