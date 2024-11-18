import React from 'react';
import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { navbarItems } from './data/navbarItems';
import { notifications } from './data/notificationData';
import RouterSwitcher from './components/RouterSwitcher';
import Header from './components/Header';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const mainNavItems = navbarItems.filter((item) => item.label !== 'Paramètres');
  const settingsItem = navbarItems.find((item) => item.label === 'Paramètres');

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <Header
        mobileOpened={mobileOpened}
        desktopOpened={desktopOpened}
        toggleMobile={toggleMobile}
        toggleDesktop={toggleDesktop}
        notifications={notifications}
      />
      <Navbar mainNavItems={mainNavItems} settingsItem={settingsItem} />
      <AppShell.Main className="main-element">
        <RouterSwitcher />
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
