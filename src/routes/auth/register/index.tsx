import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React from 'react';
import { useSupabase } from '@/components/providers/SystemProvider';
import { LoginDetailsWidget } from '@/components/widgets/LoginDetailsWidget';
import { DEFAULT_ENTRY_ROUTE, LOGIN_ROUTE } from '@/utils/router';

export const Route = createFileRoute('/auth/register/')({
  component: RegisterPage,
});

function RegisterPage() {
  const supabase = useSupabase();
  const navigate = useNavigate();

  return (
    <LoginDetailsWidget
      title="Register"
      submitTitle="Register"
      onSubmit={async ({ email, password }) => {
        if (!supabase) {
          throw new Error('Supabase has not been initialized yet');
        }
        const {
          data: { session },
          error,
        } = await supabase.client.auth.signUp({ email, password });
        if (error) {
          throw new Error(error.message);
        }

        if (session) {
          supabase.updateSession(session);
          navigate({
            to: DEFAULT_ENTRY_ROUTE,
          });
          return;
        }

        // TODO better dialog
        // eslint-disable-next-line no-alert
        alert('Registration successful, please login');
        navigate({
          to: LOGIN_ROUTE,
        });
      }}
      secondaryActions={[{ title: 'Back', onClick: () => navigate({
        to: LOGIN_ROUTE,
      }) }]}
    />
  );
}
