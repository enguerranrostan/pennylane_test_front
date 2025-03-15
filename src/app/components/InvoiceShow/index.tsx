import { useState, useEffect } from 'react'
import { useParams } from 'react-router'

import { useApi } from 'api'
import { Invoice } from 'types'

const InvoiceShow = () => {
  const { id } = useParams<{ id: string }>()
  const api = useApi()
  const [invoice, setInvoice] = useState<Invoice>()

  useEffect(() => {
    api.getInvoice(id).then(({ data }) => {
      setInvoice(data)
    })
  }, [api, id])

  return (
    <div>
      <h1 className='my-3'>{`Invoice ${invoice?.id}`}</h1>
      <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>Id</th>
          <th>Customer ID</th>
          <th>Customer name</th>
          <th>Finalized</th>
          <th>Paid</th>
          <th>Date</th>
          <th>Deadline</th>
          <th>Total</th>
          <th>Tax</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{invoice?.id}</td>
          <td>
            {invoice?.customer_id}
          </td>
          <td>
            {invoice?.customer?.first_name} {invoice?.customer?.last_name}
          </td>
          <td>
            {invoice?.finalized ? "yes" : "no"}
          </td>
          <td>
            {invoice?.paid ? "yes" : "no"}
          </td>
          <td>
            {invoice?.date}
          </td>
          <td>
            {invoice?.deadline}
          </td>
          <td>
            {invoice?.total}
          </td>
          <td>
            {invoice?.tax}
          </td>
        </tr>
      </tbody>
      </table>
      <table className="table table-bordered table-striped">
      <caption>Invoice Lines</caption>
      <thead>
        <tr>
          <th>Id</th>
          <th>Product</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>VAT Rate</th>
          <th>Tax</th>
        </tr>
      </thead>
      <tbody>
        {invoice?.invoice_lines.map((line) => (
          <tr key={line.id}>
            <td>{line.id}</td>
            <td>
              {line.product.label}
            </td>
            <td>
              {line.quantity}
            </td>
            <td>{line.price}</td>
            <td>{line.vat_rate}%</td>
            <td>{line.tax}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  )
}

export default InvoiceShow