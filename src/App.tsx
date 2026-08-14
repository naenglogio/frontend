import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { IngredientListPage, LoginPage, SignupPage } from './components/pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/ingredients" element={<IngredientListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
