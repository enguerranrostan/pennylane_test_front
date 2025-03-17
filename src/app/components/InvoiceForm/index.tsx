import { useState } from 'react';
import { useApi } from 'api'
import { useForm, SubmitHandler, Controller, useFieldArray } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import ProductAutocomplete from 'app/components/ProductAutocomplete';
import { Product } from 'types';

type InvoiceLine = {
  product_id: number;
  quantity: number;
  label: string;
  unit:  "hour" | "day" | "piece";
  vat_rate: "0" | "5.5" | "10" | "20";
  price: string | number;
  tax: string | number;
};

type InvoiceFormInputs = {
  customer_id: number;
  finalized: boolean;
  paid: boolean;
  date: string;
  deadline: string | null;
  invoice_lines_attributes: InvoiceLine[]
}

export default function App() {
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InvoiceFormInputs>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'invoice_lines_attributes',
  });
  
  const api = useApi()
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<InvoiceFormInputs> = async (invoice) => {
    try {
        setSubmitting(true);
        await api.postInvoices(null, { invoice })
        setSubmitting(false);
        setSubmitted(true)
        setInterval(() => navigate("/", { replace: true }), 2000);
    } catch(error) {
        setSubmitting(false);
        setError(`Sorry, your invoice couldn't not be created, please try again`)
    }
  }

  const handleAddProduct = () => {
    if (!selectedProduct) return;

    append({
      product_id: selectedProduct.id,
      label: selectedProduct.label,
      quantity: 1,
      unit: selectedProduct.unit,
      vat_rate: selectedProduct.vat_rate,
      price: selectedProduct.unit_price_without_tax,
      tax: selectedProduct.unit_tax
    });

    setSelectedProduct(null);
  };

  return (
    <div className="col py-5">
        <h1>Create a new invoice</h1>
        {!submitting && !submitted && (
            <>
            {error && <p className='text-danger'>{error}</p>}
            <form className="col mt-3" onSubmit={handleSubmit(onSubmit)}>
              <fieldset className="col my-3">
                <legend>Customer ID<span className='text-danger'>*</span></legend>
                <input className="form-control mx-3" type="number" id="customer_id" {...register("customer_id", { required: true })} />
                {errors.customer_id && <span className='text-danger' role="alert">This field is required</span>}
            </fieldset>
            <fieldset className="col my-3"> 
                <legend>Finalized<span className='text-danger'>*</span></legend>
                <Controller
                    control={control}
                    name="finalized"
                    rules={{
                        validate: (value) => {
                            if (value == null) {
                              return false
                            }
                            return true
                          }
                      }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <>
                        <label className="form-check-label mx-3" htmlFor="finalized">Yes</label>
                        <input className="form-check-input mx-3" type="radio" id="finalized" data-testid="finalized" onBlur={onBlur} onChange={() => onChange(true)} checked={value === true} />
                        <label className="form-check-label mx-3" htmlFor="not_finalized">No</label>
                        <input className="form-check-input mx-3" type="radio" id="not_finalized" data-testid="not_finalized" onBlur={onBlur} onChange={() => onChange(false)} checked={value === false} />
                        </>
                    )}
                    />
                {errors.finalized && <span className='text-danger' role="alert">This field is required</span>}
            </fieldset>
            <fieldset className="col my-3">
                <legend>Paid<span className='text-danger'>*</span></legend>
                <Controller
                    control={control}
                    name="paid"
                    rules={{
                        validate: (value) => {
                            if (value == null) {
                              return false
                            }
                            return true
                          }
                      }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <>
                        <label className="form-check-label mx-3" htmlFor="paid">Yes</label>
                        <input className="form-check-input mx-3" type="radio" id="paid" data-testid="paid" onBlur={onBlur} onChange={() => onChange(true)} checked={value === true} />
                        <label className="form-check-label mx-3" htmlFor="not_paid">No</label>
                        <input className="form-check-input mx-3" type="radio" id="not_paid" data-testid="not_paid" onBlur={onBlur} onChange={() => onChange(false)} checked={value === false} />
                        </>
                    )}
                    />
                {errors.paid && <span className='text-danger' role="alert">This field is required</span>}
            </fieldset>
            <fieldset className="col my-3">
                <legend>Date<span className='text-danger'>*</span></legend>
                <input className="form-control mx-3" type="date" data-testid="date" {...register("date", { required: true })} />
                {errors.date && <span className='text-danger' role="alert">This field is required</span>}
            </fieldset>
            <fieldset className="col my-3">
                <legend>Deadline<span className='text-danger'>*</span></legend>
                <input className="form-control mx-3" type="date" data-testid="deadline"  {...register("deadline", { required: true })} />
                {errors.deadline && <span className='text-danger' role="alert">This field is required</span>}
            </fieldset>
              {fields.map((item, index) => (
                  <fieldset key={item.id} className="col my-3">
                    <legend>Product {index + 1}</legend>
                    <div className="row align-items-end">
                      <div className="col">
                        <label htmlFor="label">Label</label>
                        <input className="form-control" id="label" type="text" {...register(`invoice_lines_attributes.${index}.label`)} value={item.label} readOnly />
                      </div>
                      <div className="col">
                        <label htmlFor="quantity">Quantity</label>
                        <input className="form-control" id="quantity" type="number" {...register(`invoice_lines_attributes.${index}.quantity`, { required: true, min: 1 })} defaultValue={item.quantity} />
                      </div>
                      <div className="col">
                        <button type="button" className="btn btn-danger" onClick={() => remove(index)}>
                        Remove
                      </button>
                      </div>
                    </div>
                  </fieldset>
                ))}
              <fieldset className="col my-3">
                <legend>Add products</legend>
                <div className="row align-items-center">
                  <div className="col">
                    <ProductAutocomplete value={selectedProduct} onChange={setSelectedProduct} />
                  </div>
                  <div className="col">
                    <button type="button" className="btn btn-outline-secondary" data-testid="add-product" onClick={handleAddProduct}>
                      Add product to invoice
                    </button>
                  </div>
                </div>
              </fieldset>
            <input className="form-control btn btn-primary btn-lg btn-block" type="submit" data-testid="submit" value="Create" />
            </form>
            </>
        )}
             {submitting && <p className='mt-5'>Your invoice is being created</p>}
             {submitted && <p className='text-success mt-5'>Congratulations! Your invoice has being created. You will be redirected to the homepage.</p>}
    </div>
  )
}