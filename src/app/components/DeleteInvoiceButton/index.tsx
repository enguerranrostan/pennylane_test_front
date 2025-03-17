import { useApi } from "api"

interface Props {
    id: number
    finalized: boolean
    onDelete: (id: number) => void
    onError: (error?: string) => void
}

const DeleteInvoiceButton = ({ id, finalized, onDelete, onError }: Props) => {
    const api = useApi();

    const deleteInvoice = async () => {
        try {
            onError();
            await api.deleteInvoice(id)
            onDelete(id);
        } catch(error) {
            onError(`Error: ${error}. Sorry, invoice number ${id} could not be deleted. Please try again`)
        }
      }
    
    return (
        <button className={`${finalized ? "btn btn-outline-danger" : "btn btn-danger"}`} disabled={finalized} onClick={deleteInvoice}>Delete</button>
    )
}

export default DeleteInvoiceButton