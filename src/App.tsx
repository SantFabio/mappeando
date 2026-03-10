import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ReceiverPage from './pages/ReceiverPage';

export default function App() {
  return (
    <Router basename="/dynamic-map">
      <Routes>
        {/* Página Principal (Simulador) */}
        <Route path="/" element={<MainPage />} />

        {/* Página específica para receber os dados (Receiver) */}
        <Route path="/map" element={<ReceiverPage />} />
      </Routes>
    </Router>
  );
}
