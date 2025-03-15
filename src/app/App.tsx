import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import InvoiceForm from './components/InvoiceForm'
import InvoicesList from './components/InvoicesList'
import InvoiceShow from './components/InvoiceShow'

function App() {
  return (
    <div className="px-5">
      <Router>
        <Routes>
          <Route path="/invoice/:id" Component={InvoiceShow} />
          <Route path="/" Component={InvoicesList} />
          <Route path="/create" Component={InvoiceForm} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
