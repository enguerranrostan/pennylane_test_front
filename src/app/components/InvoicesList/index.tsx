import { useApi } from 'api'
import { Invoice } from 'types'
import { useEffect, useCallback, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'

import InvoiceFilters, {FILTERS_PARAM } from "app/components/InvoiceFilters";
import FinalizeButton from 'app/components/FinalizeButton'

const InvoicesList = (): React.ReactElement => {
  const api = useApi()
  const [searchParams] = useSearchParams();

  const [invoicesList, setInvoicesList] = useState<Invoice[]>([])
  const [error, setError] = useState<string>();
  
  const filter = searchParams.get(FILTERS_PARAM) || "";

  const queryParams = {
    page: 1,
    per_page: 25,
    filter
  };

  const fetchInvoices = useCallback(async () => {
    const { data } = await api.getInvoices(queryParams)
    setInvoicesList(data.invoices)
  }, [api, searchParams])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  return (
    <div>
      <h1 className='my-3'>Find an invoice or create a new one</h1>
      {error && <span className="text-danger">{error}</span>}
      <div className='d-flex flex-row align-items-center justify-content-between py-3'>
        <InvoiceFilters/>
        <Link to="/create">Create a new invoice</Link>
      </div>
    {invoicesList.length ? 
     <table className="table table-bordered table-striped">
     <thead>
       <tr>
         <th>Id</th>
         <th>Customer</th>
         <th>Address</th>
         <th>Total</th>
         <th>Tax</th>
         <th>Finalized</th>
         <th>Paid</th>
         <th>Date</th>
         <th>Deadline</th>
       </tr>
     </thead>
     <tbody>
       {invoicesList.map((invoice) => (
         <tr key={invoice.id}>
           <td><Link to={`/invoice/${invoice.id}`}>{invoice.id}</Link></td>
           <td>
             {invoice.customer?.first_name} {invoice.customer?.last_name}
           </td>
           <td>
             {invoice.customer?.address}, {invoice.customer?.zip_code}{' '}
             {invoice.customer?.city}
           </td>
           <td>{invoice.total}</td>
           <td>{invoice.tax}</td>
           <td><FinalizeButton id={invoice.id} finalized={invoice.finalized} onChange={fetchInvoices} onError={setError} /></td>
           <td>{invoice.paid ? 'Yes' : 'No'}</td>
           <td>{invoice.date}</td>
           <td>{invoice.deadline}</td>
         </tr>
       ))}
     </tbody>
   </table>
   : 
   <p>There is no invoice for customer this ID</p>
    }
    </div>
  )
}

export default InvoicesList
