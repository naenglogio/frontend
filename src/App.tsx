import { BrowserRouter, useRoutes } from 'react-router';
// 라우트 목록은 src/routes/* 도메인 파일에 두고, 여기서는 렌더만 한다.
import { routes } from './routes';

/** BrowserRouter 컨텍스트 안에서 useRoutes 호출 */
function AppRoutes() {
  return useRoutes(routes);
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
