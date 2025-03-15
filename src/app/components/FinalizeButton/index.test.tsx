import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter} from 'react-router-dom'
import { useApi } from 'api'
import { Invoice } from 'types'
import FinalizeButton from '.';

jest.mock('api', () => ({
    useApi: jest.fn()
}));

const mockPutInvoice = jest.fn()

 const mockInvoice: Invoice = {
    id: 123,
    customer_id: 456,
    finalized: true,
    paid: true,
    date: '2025-03-15',
    deadline: '2025-04-15',
    total: "1000",
    tax: "200",
    invoice_lines: [],
  }

describe('FinalizeButton', () => {
    it('should render a button to finalize the invoice', async () => {
        (useApi as jest.Mock).mockReturnValue({
            putInvoice: mockPutInvoice.mockResolvedValue({ data: mockInvoice})
        })

        render(
            <MemoryRouter initialEntries={['/invoice/123']}>
               <FinalizeButton id={123} finalized={false} onChange={jest.fn()} onError={jest.fn()} />
            </MemoryRouter>
        )

       const button = screen.getByRole('button');
  
       await act(() => {
        fireEvent.click(button)
      });
      expect(mockPutInvoice).toHaveBeenNthCalledWith(1, 123, { invoice: {id: 123, finalized: true }})
    })
    it('should catch errors', async () => {
        (useApi as jest.Mock).mockReturnValue({
            putInvoice: mockPutInvoice.mockRejectedValue('fail')
        })
        const mockOnError = jest.fn()

        render(
            <MemoryRouter initialEntries={['/invoice/123']}>
               <FinalizeButton id={123} finalized={false} onChange={jest.fn()} onError={mockOnError} />
            </MemoryRouter>
        )

       const button = screen.getByRole('button');
  
       await act(() => {
        fireEvent.click(button)
      });
      expect(mockOnError).toHaveBeenCalledTimes(1)
    })
})