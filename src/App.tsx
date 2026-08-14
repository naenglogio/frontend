import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { LoginPage, MainPage, SignupPage } from './components/pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/mainpage" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
