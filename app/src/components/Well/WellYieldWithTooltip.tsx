import React, { useMemo } from 'react';

import styled from 'styled-components';

import { Well } from '@exchange/sdk';
import { TokenValue } from '@exchange/sdk-core';

import StartSparkle from 'src/assets/images/start-sparkle.svg';
import { mediaQuery } from 'src/breakpoints';
import useSdk from 'src/utils/sdk/useSdk';
import { THEME_COLORS } from 'src/utils/ui/theme';
import { useIsMobile } from 'src/utils/ui/useIsMobile';
import { useSiloAPYs } from 'src/wells/useSiloAPYs';

import { TokenLogo } from '../TokenLogo';
import { Tooltip, TooltipProps } from '../Tooltip';
import { BodyL, BodyS } from '../Typography';

type Props = {
  well: Well | undefined;
  apy?: TokenValue;
  loading?: boolean;
  tooltipProps?: Partial<Pick<TooltipProps, 'offsetX' | 'offsetY' | 'side'>>;
  returnNullOnNoAPY?: boolean;
};

export const WellYieldWithTooltip: React.FC<Props> = ({ tooltipProps, well, returnNullOnNoAPY = false }) => {
  const sdk = useSdk();

  const pinto = sdk.tokens.PINTO;
  const isMobile = useIsMobile();

  const { getSiloAPYWithWell } = useSiloAPYs();

  const apy = useMemo(() => {
    const data = getSiloAPYWithWell(well);

    if (!data) return undefined;
    const apy = data.bean * 100;
    return `${apy.toFixed(2)}%`;
  }, [well, getSiloAPYWithWell]);

  const tooltipWidth = isMobile ? 250 : 360;

  if (!apy) {
    if (returnNullOnNoAPY) return null;
    return <>{'-'}</>;
  }

  return (
    <TooltipContainer>
      <Tooltip
        content={
          <Container>
            <TitleContainer>
              <div className='title'>Well Yield</div>
              <div className='label-value'>
                <div className='label'>
                  <div className='logo-wrapper'>
                    <TokenLogo token={pinto} size={16} />
                  </div>
                  Pinto vAPY
                </div>
                {apy}
              </div>
            </TitleContainer>
            <ContentContainer>
              <div>
                The Variable Pinto APY (vAPY) uses historical data of Pinto earned by Silo Depositors over the previous
                30 days to estimate future returns.
              </div>
            </ContentContainer>
          </Container>
        }
        offsetY={tooltipProps?.offsetY || 0}
        offsetX={tooltipProps?.offsetX || 0}
        arrowOffset={0}
        arrowSize={0}
        side={tooltipProps?.side || 'top'}
        bgColor='white'
        width={tooltipWidth}
      >
        <ChildContainer>
          <StyledImg src={StartSparkle} alt='pinto-bean-vAPY' />
          <div>{apy} vAPY</div>
        </ChildContainer>
      </Tooltip>
    </TooltipContainer>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  padding: 4px;
  box-sizing: border-box;

  .underlined {
    text-decoration: underline;

    &:visited {
      color: #000;
    }
  }

  ${mediaQuery.sm.only} {
    gap: 16px;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 8px;

  .title {
    ${BodyS}
    font-weight: 600;
  }

  .label-value {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    ${BodyS}
    color: ${THEME_COLORS.primary};
    font-weight: 600;

    .logo-wrapper {
      position: relative;
      margin-top: 2px;
    }

    .label {
      display: flex;
      flex-direction: row;
      gap: 4px;
    }
  }
`;

const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  ${BodyS}
  text-align: left;
`;

const StyledImg = styled.img`
  display: flex;
  width: 24px;
  height: 24px;
  padding: 3px 2px 3px 3px;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;

  ${mediaQuery.sm.only} {
    height: 20px;
    width: 20px;
  }
`;

const ChildContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  background: #edf8ee;
  padding: 4px;
  color: ${THEME_COLORS.primary};
  width: max-content;
  border-radius: 4px;

  ${BodyL}
  font-weight: 600;

  ${mediaQuery.sm.only} {
    ${BodyS}
  }
`;

const TooltipContainer = styled.div`
  width: max-content;
`;
