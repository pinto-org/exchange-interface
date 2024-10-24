import React, { FC } from 'react';

import styled from 'styled-components';

import { Well } from '@exchange/sdk';
import { TokenValue } from '@exchange/sdk-core';

import { mediaQuery } from 'src/breakpoints';
import { Info } from 'src/components/Icons';
import { Item, Row } from 'src/components/Layout';
import { TokenLogo } from 'src/components/TokenLogo';
import { Tooltip, TooltipProps } from 'src/components/Tooltip';
import { BodyS } from 'src/components/Typography';
import { formatNum } from 'src/utils/format';
import { THEME_COLORS } from 'src/utils/ui/theme';

export const MultiFlowPumpTooltip: FC<{
  well: Well;
  twaReserves: TokenValue[] | undefined;
  children?: React.ReactNode; // if no children, then the tooltip icon is rendered
  tooltipProps?: TooltipProps;
}> = ({ well, children, tooltipProps, twaReserves }) => {
  const token1 = well.tokens?.[0];
  const reserve1 = well.reserves?.[0];

  const token2 = well.tokens?.[1];
  const reserve2 = well.reserves?.[1];

  const twaReserves1 = twaReserves?.[0];
  const twaReserves2 = twaReserves?.[1];

  if (!token1 || !token2 || !reserve1 || !reserve2) return null;

  return (
    <Tooltip
      content={
        <Container>
          <TitleAndContentContainer column stretch>
            <div className='container-title'>Multi Flow Pump</div>
            <div className='content'>
              The&nbsp;
              <a className='content-link' href='/multi-flow-pump.pdf' target='_blank' rel='noopener noreferrer'>
                Multi Flow Pump
              </a>
              , an inter-block MEV manipulation resistant oracle, stores reserve data from this Well. In particular,
              Multi Flow stores reserve data in two formats:
            </div>
          </TitleAndContentContainer>
          <ReservesInfo column stretch>
            <ReserveData column stretch>
              <div className='reserve-type'>Instantaneous reserves</div>
              <StyledItem stretch>
                <StyledRow>
                  <div className='reserve-token-container'>
                    <TokenLogo token={token1} size={16} />
                    {token1.symbol}
                  </div>
                  {formatNum(reserve1, { minDecimals: 2 })}
                </StyledRow>
              </StyledItem>
              <StyledItem stretch>
                <StyledRow>
                  <div className='reserve-token-container'>
                    <TokenLogo token={token2} size={16} />
                    {token2.symbol}
                  </div>
                  {formatNum(reserve2, { minDecimals: 2 })}
                </StyledRow>
              </StyledItem>
            </ReserveData>
            {twaReserves1 && twaReserves2 && (
              <ReserveData column stretch>
                <div className='reserve-type'>Time-weighted average reserves</div>
                <StyledItem stretch>
                  <StyledRow>
                    <div className='reserve-token-container'>
                      <TokenLogo token={token1} size={16} />
                      {token1.symbol}
                    </div>
                    {formatNum(twaReserves1, { minDecimals: 2 })}
                  </StyledRow>
                </StyledItem>
                <StyledItem stretch>
                  <StyledRow>
                    <div className='reserve-token-container'>
                      <TokenLogo token={token2} size={16} />
                      {token2.symbol}
                    </div>
                    {formatNum(twaReserves2, { minDecimals: 2 })}
                  </StyledRow>
                </StyledItem>
              </ReserveData>
            )}
          </ReservesInfo>
        </Container>
      }
      offsetX={0}
      offsetY={0}
      arrowSize={0}
      arrowOffset={0}
      side='top'
      bgColor='white'
      width={370}
      {...tooltipProps}
    >
      {children ? children : <Info color={THEME_COLORS.lightGray} width={14} height={14} />}
    </Tooltip>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 12px;
  box-sizing: border-box;

  ${mediaQuery.sm.only} {
    gap: 16px;
  }
`;

const TitleAndContentContainer = styled(Item)`
  width: 100%;

  gap: 8px;
  ${BodyS}

  .container-title {
    font-weight: 600;
  }

  .content {
    color: ${THEME_COLORS.darkGray};

    .content-link {
      color: ${THEME_COLORS.primary};
      cursor: pointer;
      text-decoration: none;

      :focus {
        text-decoration: none;
      }
    }
  }
`;

const ReservesInfo = styled(Item)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ReserveData = styled(Item)`
  font-weight: 600;
  gap: 4px;

  .reserve-type {
    ${BodyS}
    font-weight: 400;
    color: ${THEME_COLORS.darkGray};
  }

  .reserve-token-container {
    display: flex;
    flex-direction: row;
    gap: 4px;
  }
`;

const StyledItem = styled(Item)`
  gap: 4px;
`;

const StyledRow = styled(Row)`
  width: 100%;
  justify-content: space-between;
`;
