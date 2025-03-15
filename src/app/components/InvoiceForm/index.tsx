import { useState } from 'react';
import { useApi } from 'api'
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { useNavigate } from "react-router-dom";

type Inputs = {
  customer_id: number,
  finalized: boolean,
  paid: boolean,
  date: string,
  deadline: string | null,
}

export default function App() {
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [error, setError] = useState<string | null>()
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()
  const api = useApi()
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = async (invoice) => {
    try {
        setSubmitting(true);
        await api.postInvoices(null, {invoice})
        setSubmitting(false);
        setSubmitted(true)
        setInterval(() => navigate("/", { replace: true }), 2000);
    } catch(error) {
        setSubmitting(false);
        setError(`Sorry, your invoice couldn't not be created, please try again`)
    }
  }

  return (
    <div className="py-5">
        <h1>Create a new invoice</h1>
        {!submitting && !submitted && (
            <>
            {error && <p className='text-danger'>{error}</p>}
            <form className="mt-3" onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="my-2">
                <legend>Customer ID<span className='text-danger'>*</span></legend>
                <input className="mx-3" type="number" id="customer_id" {...register("customer_id", { required: true })} />
                {errors.customer_id && <span className='text-danger' role="alert">This field is required</span>}
            </fieldset>
            <fieldset className="my-2"> 
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
                        <label className="mx-3" htmlFor="finalized">Yes</label>
                        <input className="mx-3" type="radio" id="finalized" data-testid="finalized" onBlur={onBlur} onChange={() => onChange(true)} checked={value === true} />
                        <label className="mx-3" htmlFor="not_finalized">No</label>
                        <input className="mx-3" type="radio" id="not_finalized" data-testid="not_finalized" onBlur={onBlur} onChange={() => onChange(false)} checked={value === false} />
                        </>
                    )}
                    />
                {errors.finalized && <span className='text-danger' role="alert">This field is required</span>}
            </fieldset>
            <fieldset className="my-2">
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
                        <label className="mx-3" htmlFor="paid">Yes</label>
                        <input className="mx-3" type="radio" id="paid" data-testid="paid" onBlur={onBlur} onChange={() => onChange(true)} checked={value === true} />
                        <label className="mx-3" htmlFor="not_paid">No</label>
                        <input className="mx-3" type="radio" id="not_paid" data-testid="not_paid" onBlur={onBlur} onChange={() => onChange(false)} checked={value === false} />
                        </>
                    )}
                    />
                {errors.paid && <span className='text-danger' role="alert">This field is required</span>}
            </fieldset>
            <fieldset className="my-2">
                <legend>Date<span className='text-danger'>*</span></legend>
                <input className="mx-3" type="date" data-testid="date" {...register("date", { required: true })} />
                {errors.date && <span className='text-danger' role="alert">This field is required</span>}
            </fieldset>
            <fieldset className="my-2">
                <legend>Deadline<span className='text-danger'>*</span></legend>
                <input className="mx-3" type="date" data-testid="deadline"  {...register("deadline", { required: true })} />
                {errors.deadline && <span className='text-danger' role="alert">This field is required</span>}
            </fieldset>
            <input className="mt-3" type="submit" value="Create" />
            </form>
            </>
        )}
             {submitting && <p className='mt-5'>Your invoice is being created</p>}
             {submitted && <p className='text-success mt-5'>Congratulations! Your invoice has being created. You will be redirected to the homepage.</p>}
    </div>
  )
}