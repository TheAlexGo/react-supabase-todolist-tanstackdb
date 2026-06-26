import React from 'react';

export interface NavigationPanelController {
  setTitle: (title: string) => void;
  title: string;
}

export const NavigationPanelContext = React.createContext<NavigationPanelController>({
  setTitle: () => {
    throw new Error(`No NavigationPanelContext has been provided`);
  },
  title: '',
});

export function NavigationPanelContextProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = React.useState('');

  return <NavigationPanelContext value={{ title, setTitle }}>{children}</NavigationPanelContext>;
}

export const useNavigationPanel = () => React.use(NavigationPanelContext);
