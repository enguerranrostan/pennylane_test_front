import { OperationMethods } from 'api/gen/client'
import { Awaited } from './helpers'

export type Invoice = Awaited<
  ReturnType<OperationMethods['getInvoices']>
>['data']['invoices'][0]

export type Product = Awaited<
  ReturnType<OperationMethods['getSearchProducts']>
>['data']['products'][0]

export type Customer = Awaited<
  ReturnType<OperationMethods['getSearchCustomers']>
>['data']['customers'][0]

export type Filter = {
  field: String
  operator: 'eq' | 'not_eq' | 'lt' | 'lteq' | 'gt' | 'gteq'
  value: String | Number
}
