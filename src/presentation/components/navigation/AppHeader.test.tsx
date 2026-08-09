import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router';

import { AppHeader } from '@/presentation/components/navigation/AppHeader';

function LocationDisplay() {
  const location = useLocation();

  return <output aria-label="Localização atual">{`${location.pathname}${location.search}`}</output>;
}

describe('AppHeader', () => {
  it('starts an automatic search after two characters and refines it with debounce', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AppHeader />
        <LocationDisplay />
      </MemoryRouter>,
    );

    const searchInput = screen.getByRole('searchbox', { name: /Buscar filmes/ });
    await user.type(searchInput, 'Ma');

    await waitFor(() => {
      expect(screen.getByRole('status', { name: 'Localização atual' })).toHaveTextContent(
        '/search?q=Ma',
      );
    });
    expect(searchInput).toHaveFocus();

    await user.type(searchInput, 'trix');

    await waitFor(() => {
      expect(screen.getByRole('status', { name: 'Localização atual' })).toHaveTextContent(
        '/search?q=Matrix',
      );
    });
  });
});
