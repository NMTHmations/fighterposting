import { Router, Route } from '@solidjs/router';
import { lazy } from 'solid-js';

const Main = lazy(() => import('./pages/main'));
const what_is_this = lazy(() => import('./pages/what-is-this'));
const upload = lazy(() => import('./pages/upload'));
const success = lazy(() => import('./pages/success'));
const Login = lazy(() => import('./pages/admin_panel/login'));
const AdminMain = lazy(() => import('./pages/admin_panel/main'));
const Reviews = lazy(() => import('./pages/admin_panel/reviews'));
const fights = lazy(() => import('./pages/fights'));
const Posts = lazy(() => import('./pages/admin_panel/posts'));
const Settings = lazy(() => import('./pages/admin_panel/settings'));
const fight = lazy(() => import('./pages/fight'))
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <Router>
      <Route path="/" component={Main} />
      <Route path="/what-is-this" component={what_is_this} />
      <Route path="/upload" component={upload} />
      <Route path="/success" component={success} />
      <Route path="/admin" component={Login} />
      <Route path="/admin/main" component={AdminMain} />
      <Route path="/admin/reviews" component={Reviews} />
      <Route path="/admin/posts" component={Posts} />
      <Route path="/admin/settings" component={Settings} />
      <Route path="/fights" component={fights} />
      <Route path="/fight/:slug" component={fight} />
      <Route path="/*all" component={NotFound} />
    </Router>
  );
}
