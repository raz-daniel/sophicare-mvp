import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from '../store';
import { Layout } from './layout/Layout';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout />
        <Toaster position="top-right" />
      </Router>
    </Provider>
  );
}

export default App;