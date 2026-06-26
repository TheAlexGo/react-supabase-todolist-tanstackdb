import type { PropsWithChildren } from 'react';
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import React from 'react';
import ViewsLayout from '@/components/layouts/ViewsLayout';
import { useSupabase } from '@/components/providers/SystemProvider';
import { LOGIN_ROUTE } from '@/utils/router';

export const Route = createFileRoute('/views')({
  component: ViewsLayoutRoute,
});

interface AuthGuardProps extends PropsWithChildren {
}

export function AuthGuard({ children }: AuthGuardProps) {
  const connector = useSupabase();

  const navigate = useNavigate();
  React.useEffect(() => {
    if (!connector) {
      console.error(`No Supabase connector has been created yet.`);
      return;
    }

    connector.client.auth.onAuthStateChange(async (event, _session) => {
      if (event === 'SIGNED_OUT') {
        navigate({
          to: LOGIN_ROUTE,
        });
      }
    });

    const loginGuard = () => {
      if (!connector.currentSession) {
        navigate({
          to: LOGIN_ROUTE,
        });
      }
    };
    if (connector.ready) {
      loginGuard();
    }
    else {
      const l = connector.registerListener({
        initialized: () => {
          loginGuard();
        },
      });
      return () => l?.();
    }
  }, [connector, navigate]);
  return children;
}

function ViewsLayoutRoute() {
  return (
    <AuthGuard>
      <ViewsLayout>
        <Outlet />
      </ViewsLayout>
    </AuthGuard>
  );
}
