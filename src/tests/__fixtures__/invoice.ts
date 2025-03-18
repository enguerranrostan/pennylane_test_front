import { Invoice } from 'types'

export const mockInvoice: Invoice = {
  id: 123,
  customer_id: 456,
  finalized: false,
  paid: true,
  date: '2025-03-15',
  deadline: '2025-04-15',
  total: '120',
  tax: '20',
  invoice_lines: [
    {
      id: 9181,
      invoice_id: 123,
      product_id: 67,
      quantity: 1,
      label: 'Tesla Model S with Pennylane logo',
      unit: 'hour',
      vat_rate: '0',
      price: '120.00',
      tax: '20.00',
      product: {
        id: 67,
        label: 'Tesla Model S',
        vat_rate: '0',
        unit: 'hour',
        unit_price: '1980',
        unit_price_without_tax: '1800',
        unit_tax: '180',
      },
    },
  ],
}

export const createMockInvoice = (
  overrides: Partial<Invoice> = {}
): Invoice => ({
  ...mockInvoice,
  ...overrides,
})
