import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter,} from 'react-router-dom'
import "@testing-library/jest-dom"
import { useApi } from 'api'
import InvoiceForm from '.';

jest.mock('api');

describe('InvoiceForm', () => {
    it('should display required error when value is invalid', async () => {
        const route = '/some-route'
        render(<MemoryRouter initialEntries={[route]}><InvoiceForm/></MemoryRouter>)
        fireEvent.submit(screen.getByRole("button"))
        expect(await screen.findAllByRole("alert")).toHaveLength(5)
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
            fireEvent.submit(screen.getByRole("button"))
          });
        expect(await screen.queryAllByRole("alert")).toHaveLength(0)
        expect(useApi).toHaveBeenCalledWith()
    })
})