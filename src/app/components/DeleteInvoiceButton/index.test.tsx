import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { MemoryRouter} from 'react-router-dom'
import '@testing-library/jest-dom'
import { useApi } from 'api'
import DeleteButton from '.';

jest.mock('api', () => ({
    useApi: jest.fn()
}));

const mockDeleteButton = jest.fn()

describe('DeleteButton', () => {
    it('should render a button to delete the invoice', async () => {
        (useApi as jest.Mock).mockReturnValue({
            deleteInvoice: mockDeleteButton.mockRejectedValue(null)
        })
        const mockOnDelete = jest.fn()

        render(
            <MemoryRouter initialEntries={['/']}>
               <DeleteButton id={123} finalized={false} onDelete={jest.fn()} onError={jest.fn()} />
            </MemoryRouter>
        )

       const button = screen.getByRole('button');
  
       await act(() => {
        fireEvent.click(button)
      });
      expect(mockDeleteButton).toHaveBeenNthCalledWith(1, 123)
      waitFor(() => {
        expect(mockOnDelete).toBeCalledTimes(1)
      })
    })

    it('should catch errors', async () => {
        (useApi as jest.Mock).mockReturnValue({
            deleteInvoice: mockDeleteButton.mockRejectedValue('fail')
        })
        const mockOnError = jest.fn()

        render(
            <MemoryRouter initialEntries={['/']}>
               <DeleteButton id={123} finalized={false} onDelete={jest.fn()} onError={mockOnError} />
            </MemoryRouter>
        )

       const button = screen.getByRole('button');
  
       await act(() => {
        fireEvent.click(button)
      });
      expect(mockOnError).toHaveBeenCalled()
    })

    it('should be disabled when invoice is finalized', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
               <DeleteButton id={123} finalized={true} onDelete={jest.fn()} onError={jest.fn()} />
            </MemoryRouter>
        )

       const button = screen.getByRole('button');

       expect(button).toBeDisabled()
    })
})