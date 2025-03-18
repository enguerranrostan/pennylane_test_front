import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route} from 'react-router-dom'
import "@testing-library/jest-dom"
import { useApi } from 'api'
import { mockInvoice, createMockInvoice } from "tests/__fixtures__/invoice"
import InvoiceShow from '.';

jest.mock('api', () => ({
    useApi: jest.fn()
}));

const mockGetInvoice = jest.fn()

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
            expect(screen.getByText('120')).toBeInTheDocument()
            expect(screen.getByText('20')).toBeInTheDocument()
            expect(screen.getByText('9181')).toBeInTheDocument()
            expect(screen.getByText('Tesla Model S')).toBeInTheDocument()
            expect(screen.getByText('1')).toBeInTheDocument()
            expect(screen.getByText('120')).toBeInTheDocument()
            expect(screen.getByText('0%')).toBeInTheDocument()
            expect(screen.getByText('20')).toBeInTheDocument()
        })
    })
    it('should not render render invoice lines when empty', async () => {
        const invoiceWithEmptyLines = createMockInvoice({ invoice_lines: []});

        (useApi as jest.Mock).mockReturnValue({
            getInvoice: mockGetInvoice.mockResolvedValue({ data: invoiceWithEmptyLines})
        })
        render(
            <MemoryRouter initialEntries={['/invoice/123']}>
                <Routes>
                    <Route path="/invoice/:id" element={<InvoiceShow />} />
                </Routes>
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(screen.queryByText('Invoice Lines')).not.toBeInTheDocument()
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