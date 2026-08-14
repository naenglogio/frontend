import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { IngredientListPage, LoginPage, ProfilePage, SignupPage } from './components/pages';
import { RequireAuth } from './components/RequireAuth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* 로그인해야 볼 수 있는 페이지는 아래처럼 <RequireAuth>로 감싸서 등록할 것 */}
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        <Route
          path="/ingredients"
          element={
            <RequireAuth>
              <IngredientListPage />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
