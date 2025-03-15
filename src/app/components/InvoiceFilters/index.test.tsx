import { render, screen } from '@testing-library/react';
import { MemoryRouter,} from 'react-router-dom'
import '@testing-library/jest-dom'
import InvoiceFilters from '.';

jest.mock('app/components/CustomerAutocomplete', () => (props: any) => (
  <input 
    data-testid="customer-autocomplete"
    value={props.value?.name || ''}
    onChange={(e) => props.onChange({ id: 1, name: e.target.value })}
  />
));

describe('InvoiceFilters', () => {
  it('should render the customer input', () => {
    const route = '/some-route'
    render(<MemoryRouter initialEntries={[route]}><InvoiceFilters /></MemoryRouter>);
    const customerInput = screen.getByTestId('customer-autocomplete');
    expect(customerInput).toBeInTheDocument()
  })
  
//   it('should update search params when a customer is selected', () => {
//     let testHistory, testLocation
//     const route = '/some-route'
//     render(
//     <MemoryRouter initialEntries={[route]}>
//         <Routes location={testLocation}>
//             <Route/>
//         </Routes>
//         <InvoiceFilters />
//     </MemoryRouter>);


//     const customerInput = screen.getByTestId('customer-autocomplete');
//     fireEvent.change(customerInput, { target: { value: 'John Doe' } });
    
//     const searchParams = new URLSearchParams(testLocation?.search);
//     expect(searchParams.get(FILTERS_PARAM)).toEqual(
//       JSON.stringify([{ field: 'customer_id', operator: 'eq', value: 1 }])
//     );
//   })
});