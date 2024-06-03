import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Homepage from './Homepage';
import MultistepForm from './MultistepForm';
import FillPdfForm from './FillPDFForm';

function App() {
  return (
    <>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/multistep-form' element={<MultistepForm />} />
        </Routes>
      </BrowserRouter>
      {/* <FillPdfForm />  */}
    </>
  );
}

export default App;
