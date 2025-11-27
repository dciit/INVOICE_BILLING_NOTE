import { createContext, StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import type { ContextInterface } from './interface/main.interface.ts'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'
import Routers from './routers.tsx'
const context: ContextInterface = {
  appname: 'INVOICECONTROL',
  style: {
    baseColorText: 'text-[#1990ff]',
  },
}

export const ThemeContext = createContext<ContextInterface>({});
ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeContext.Provider value={context}>
    <Provider store={store}>
      <Routers />
    </Provider>
  </ThemeContext.Provider>
)
