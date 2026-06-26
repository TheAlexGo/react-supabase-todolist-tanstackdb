import { CircularProgress } from '@mui/material';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React, { useCallback } from 'react';
import { useSupabase } from '@/components/providers/SystemProvider';
import { DEFAULT_ENTRY_ROUTE, LOGIN_ROUTE } from '@/utils/router';
import { S } from './-styles';

export interface LoginFormParams {
  email: string;
  password: string;
}

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const connector = useSupabase();
  const navigate = useNavigate();

  const navigateToMainView = useCallback(() => {
    if (connector?.currentSession) {
      navigate({
        to: DEFAULT_ENTRY_ROUTE,
      });
    }
  }, [connector?.currentSession, navigate]);

  React.useEffect(() => {
    if (!connector) {
      console.error(`No Supabase connector has been created yet.`);
      return;
    }

    if (!connector.ready) {
      const l = connector.registerListener({
        initialized: () => {
          /**
           * Redirect if on the entry view
           */
          if (connector.currentSession) {
            navigate({
              to: DEFAULT_ENTRY_ROUTE,
            });
          }
          else {
            navigate({
              to: LOGIN_ROUTE,
            });
          }
        },
      });
      return () => l?.();
    }

    // There should be a session at this point. The auth guard will navigate to the login if not
    navigateToMainView();
  }, [connector, navigate, navigateToMainView]);

  return (
    <S.MainGrid container>
      <S.CenteredGrid item xs={12} md={6} lg={5}>
        <CircularProgress />
      </S.CenteredGrid>
    </S.MainGrid>
  );
}
