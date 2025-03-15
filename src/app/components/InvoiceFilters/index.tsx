import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CustomerAutocomplete from 'app/components/CustomerAutocomplete';
import { Customer, Filter } from 'types';

export const FILTERS_PARAM = 'filter';

const InvoiceFilters = () => {
  const [, setSearchParams] = useSearchParams();
  const [customer, setCustomer] = useState<Customer | null>(null);

  const updateSearchParams = (newCustomer: Customer | null) => {
    const filter: Filter[] = [];
    if (newCustomer) filter.push({ field: 'customer_id', operator: 'eq', value: newCustomer.id });
    
    setSearchParams({ [FILTERS_PARAM]: JSON.stringify(filter) });
  };

  return (
        <CustomerAutocomplete 
          value={customer} 
          onChange={(newCustomer) => {
            setCustomer(newCustomer);
            updateSearchParams(newCustomer);
          }}
        />
  );
};

export default InvoiceFilters;
