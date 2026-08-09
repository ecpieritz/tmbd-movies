import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Pagination } from '@/presentation/components/navigation/Pagination';

describe('Pagination', () => {
  it('provides first, previous, numbered, next and last-page navigation', async () => {
    const onPageChange = jest.fn<(page: number) => void>();
    const user = userEvent.setup();

    render(<Pagination currentPage={3} totalPages={50} onPageChange={onPageChange} />);

    expect(screen.getByRole('button', { name: 'Página 3' })).toHaveAttribute(
      'aria-current',
      'page',
    );

    await user.click(screen.getByRole('button', { name: 'Primeira página' }));
    await user.click(screen.getByRole('button', { name: 'Página anterior' }));
    await user.click(screen.getByRole('button', { name: 'Próxima página' }));
    await user.click(screen.getByRole('button', { name: 'Última página' }));

    expect(onPageChange.mock.calls.map(([page]) => page)).toEqual([1, 2, 4, 50]);
  });

  it('navigates to a valid page typed by the user', async () => {
    const onPageChange = jest.fn<(page: number) => void>();
    const user = userEvent.setup();

    render(<Pagination currentPage={3} totalPages={50} onPageChange={onPageChange} />);

    const pageInput = screen.getByRole('spinbutton', { name: 'Ir para a página' });
    await user.type(pageInput, '25{Enter}');

    expect(onPageChange).toHaveBeenCalledWith(25);
  });

  it('shows every page when the result has no long range to collapse', () => {
    render(<Pagination currentPage={2} totalPages={4} onPageChange={jest.fn()} />);

    expect(screen.queryByRole('spinbutton', { name: 'Ir para a página' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Página 4' })).toBeInTheDocument();
  });
});
