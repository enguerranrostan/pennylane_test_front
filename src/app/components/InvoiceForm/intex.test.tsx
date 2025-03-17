import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { MemoryRouter,} from 'react-router-dom'
import '@testing-library/jest-dom'
import { useApi } from 'api'
import InvoiceForm from '.';
import { Product } from 'types';
import { skip } from 'node:test';

jest.mock('api', () => ({
    useApi: jest.fn()
}));

const mockPostInvoice = jest.fn()

const mockProduct: Product = {
    id: 1,
    label: "mock product",
    vat_rate: "0",
    unit: "piece",
    unit_price: "10",
    unit_price_without_tax: "10",
    unit_tax: "0",
}

jest.mock('app/components/ProductAutocomplete', () => {
    return ({ onChange }: { onChange: (product: Product) => void }) => (
        <div data-testid="product-autocomplete">
          <button
            onClick={() => onChange(mockProduct)}
            data-testid="select-product"
          >
            Select Product
          </button>
        </div>
      );
})

describe('InvoiceForm', () => {
    it('should display required error when value is invalid', async () => {
        const route = '/some-route'
        render(<MemoryRouter initialEntries={[route]}><InvoiceForm/></MemoryRouter>)
        
        await act(() => {
            fireEvent.submit(screen.getByTestId("submit"))
        })

        waitFor(() => {
            expect(screen.findAllByRole("alert")).toHaveLength(5) 
        })
    })

    it('should not display error when value is valid', async () => {
        const route = '/some-route'
        render(<MemoryRouter initialEntries={[route]}><InvoiceForm/></MemoryRouter>)

        fireEvent.input(screen.getByRole("spinbutton"), {
            target: {
                value: 1,
            },
        })
        fireEvent.click(screen.getByTestId("finalized"))
        fireEvent.click(screen.getByTestId("paid"))
        fireEvent.input(screen.getByTestId("date"), {
            target: {
                value: "2025-03-15",
            },
        })
        fireEvent.input(screen.getByTestId("deadline"), {
            target: {
                value: "2025-03-15",
            },
        })

        await act(() => {
            fireEvent.submit(screen.getByTestId("submit"))
        })

        expect(screen.queryAllByRole("alert")).toHaveLength(0)
    })

    it('should add invoice lines', async () => {
        const route = '/some-route'
        render(<MemoryRouter initialEntries={[route]}><InvoiceForm/></MemoryRouter>)

        fireEvent.input(screen.getByRole("spinbutton"), {
            target: {
                value: 1,
            },
        })
        fireEvent.click(screen.getByTestId("finalized"))
        fireEvent.click(screen.getByTestId("paid"))
        fireEvent.input(screen.getByTestId("date"), {
            target: {
                value: "2025-03-15",
            },
        })
        fireEvent.input(screen.getByTestId("deadline"), {
            target: {
                value: "2025-03-15",
            },
        })

        await act(() => {
            fireEvent.click(screen.getByTestId("product-autocomplete"));
            fireEvent.click(screen.getByTestId("add-product"));
        })

        waitFor(() => {
            expect(screen.getByText('mock product')).toBeInTheDocument();
        })
        
    })

    it('should submit the form', async () => {
        (useApi as jest.Mock).mockReturnValue({
                postInvoice: mockPostInvoice.mockResolvedValue(null)
        })
        const route = '/some-route'
        render(<MemoryRouter initialEntries={[route]}><InvoiceForm/></MemoryRouter>)

        fireEvent.input(screen.getByRole("spinbutton"), {
            target: {
                value: 1,
            },
        })
        fireEvent.click(screen.getByTestId("finalized"))
        fireEvent.click(screen.getByTestId("paid"))
        fireEvent.input(screen.getByTestId("date"), {
            target: {
                value: "2025-03-15",
            },
        })
        fireEvent.input(screen.getByTestId("deadline"), {
            target: {
                value: "2025-03-15",
            },
        })

        await act(() => {
            fireEvent.click(screen.getByTestId("product-autocomplete"));
            fireEvent.click(screen.getByTestId("add-product"));
            fireEvent.submit(screen.getByTestId("submit"))
        })

        waitFor(() => {
            expect(mockPostInvoice).toHaveBeenCalledWith(null, {
              invoice: expect.objectContaining({
                customer_id: 1,
                finalized: true,
                paid: true,
                date: '2025-03-15',
                deadline: '2025-03-15',
                invoice_lines_attributes: expect.arrayContaining([
                  expect.objectContaining({
                    id:1,
                    label: "mock product",
                    vat_rate: "0",
                    unit: "piece",
                    unit_price: "10",
                    unit_price_without_tax: "10",
                    unit_tax: "0",
                  }),
                ]),
              }),
            });
        });
    })
})