import { Box, styled } from '@mui/material';
import React from 'react';
import { useNavigationPanel } from './NavigationPanelContext';

namespace S {
  export const Container = styled(Box)`
    margin: 10px;
  `;
}

/**
 * Wraps a component with automatic navigation panel title management
 */
export const NavigationPage: React.FC<React.PropsWithChildren<{ title: string }>> = ({ title, children }) => {
  const navigationPanel = useNavigationPanel();

  React.useEffect(() => {
    navigationPanel.setTitle(title);

    return () => navigationPanel.setTitle('');
  }, [title, navigationPanel]);

  return <S.Container>{children}</S.Container>;
};
