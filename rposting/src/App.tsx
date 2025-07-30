import { Router, Route } from '@solidjs/router';
import { lazy } from 'solid-js';

const Main = lazy(() => import('./pages/main'));
const what_is_this = lazy(() => import('./pages/what-is-this'));
const upload = lazy(() => import('./pages/upload'));

export default function App() {
  return (
    <Router>
      <Route path="/" component={Main} />
      <Route path="/what-is-this" component={what_is_this} />
      <Route path="/upload" component={upload} />
    </Router>
  );
}
