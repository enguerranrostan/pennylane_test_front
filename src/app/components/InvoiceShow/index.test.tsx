import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route} from 'react-router-dom'
import "@testing-library/jest-dom"
import { useApi } from 'api'
import { Invoice } from 'types'
import InvoiceShow from '.';

jest.mock('api', () => ({
    useApi: jest.fn()
}));

const mockGetInvoice = jest.fn()

  const mockInvoice: Invoice = {
    id: 123,
    customer_id: 456,
    finalized: false,
    paid: true,
    date: '2025-03-15',
    deadline: '2025-04-15',
    total: "1000",
    tax: "200",
    invoice_lines: [],
  }

describe('InvoiveShow', () => {
    beforeEach(() => (
        (useApi as jest.Mock).mockReturnValue({
            getInvoice: mockGetInvoice.mockResolvedValue({ data: mockInvoice})
        })
    ))
    it('should render the invoice', async () => {
        render(
            <MemoryRouter initialEntries={['/invoice/123']}>
                <Routes>
                    <Route path="/invoice/:id" element={<InvoiceShow />} />
                </Routes>
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(mockGetInvoice).toHaveBeenCalledWith('123')
            expect(screen.getByText('Invoice 123')).toBeInTheDocument()
            expect(screen.getByText('456')).toBeInTheDocument()
            expect(screen.getByText('yes')).toBeInTheDocument()
            expect(screen.getByText('2025-03-15')).toBeInTheDocument()
            expect(screen.getByText('2025-04-15')).toBeInTheDocument()
            expect(screen.getByText('1000')).toBeInTheDocument()
            expect(screen.getByText('200')).toBeInTheDocument()
        })
    })

    it('should render a button to finalize the invoice', async () => {
        render(
            <MemoryRouter initialEntries={['/invoice/123']}>
                <Routes>
                    <Route path="/invoice/:id" element={<InvoiceShow />} />
                </Routes>
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(screen.getByRole('button')).toBeInTheDocument()
        })
    })
})