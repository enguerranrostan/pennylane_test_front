import { useApi } from 'api'
import { Invoice } from 'types'

interface Props {
  id: number
  finalized: boolean
  onChange: (data: Invoice) => void
  onError: (error: string) => void 
}

const FinalizeButton = ({ id, finalized, onChange, onError }: Props) => {
    const api = useApi();

    const finalize = async () => {
        try {
          const { data } = await api.putInvoice(id, { invoice: { id, finalized: true } })
          onChange(data);
        } catch(error) {
            onError(`Error: ${error}. Sorry, your invoice could not be finalized. Please try again.`)
        }
      }
    
    return (
        <button className={`${finalized ? "btn btn-light": "btn btn-outline-secondary"}`} disabled={finalized} onClick={finalize}>{finalized ? "Finalized" : "Finalize"}</button>
    )
}

export default FinalizeButton