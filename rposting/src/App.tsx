import { Router, Route } from '@solidjs/router';
import { lazy } from 'solid-js';

const Main = lazy(() => import('./pages/main'));

export default function App() {
  return (
    <Router>
      <Route path="/" component={Main} />
    </Router>
  );
}
