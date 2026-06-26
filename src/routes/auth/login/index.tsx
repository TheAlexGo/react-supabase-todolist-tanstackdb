import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React from 'react';
import { useSupabase } from '@/components/providers/SystemProvider';
import { LoginDetailsWidget } from '@/components/widgets/LoginDetailsWidget';
import { DEFAULT_ENTRY_ROUTE } from '@/utils/router';

export const Route = createFileRoute('/auth/login/')({
  component: LoginPage,
});

function LoginPage() {
  const supabase = useSupabase();
  const navigate = useNavigate();

  return (
    <LoginDetailsWidget
      title="Login"
      submitTitle="Login"
      onSubmit={async (values) => {
        if (!supabase) {
          throw new Error('Supabase has not been initialized yet');
        }
        await supabase.login(values.email, values.password);
        navigate({
          to: DEFAULT_ENTRY_ROUTE,
        });
      }}
      secondaryActions={[
        {
          title: 'Register',
          onClick: () => {
            navigate({
              to: '/auth/register',
            });
          },
        },
      ]}
    />
  );
}
