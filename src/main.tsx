import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import store from "./app/store";
import { Provider } from 'react-redux';

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <div className="overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <App />
    </div>
  </Provider>
);
