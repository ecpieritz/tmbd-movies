import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { fetchMock, mockApiResponse } from '@/test/mocks/fetchMock';

function TestButton({ onClick }: { readonly onClick: () => void }) {
  return <button onClick={onClick}>Explorar filmes</button>;
}

describe('test environment', () => {
  it('provides React Testing Library and jest-dom matchers', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<TestButton onClick={handleClick} />);

    const button = screen.getByRole('button', { name: 'Explorar filmes' });

    expect(button).toBeInTheDocument();
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('intercepts API calls without making a network request', async () => {
    mockApiResponse({ page: 1, results: [] });

    const response = await fetch('/api/tmdb/movie/popular');

    await expect(response.json()).resolves.toEqual({ page: 1, results: [] });
    expect(fetchMock).toHaveBeenCalledWith('/api/tmdb/movie/popular');
  });
});
