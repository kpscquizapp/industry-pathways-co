import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import userAuth from '../app/slices/userAuth';
import extractResumeSkills from '../app/slices/extractResumeSkills';
import { loginApi } from '../app/queries/loginApi';
import { profileApi } from '../app/queries/profileApi';
import { jobApi } from '../app/queries/jobApi';
import { atsApi } from '../app/queries/atsApi';
import { benchApi } from '../app/queries/benchApi';
import { aiShortlistApi } from '../app/queries/aiShortlistApi';
import { employerApi } from '../app/queries/employerApi';

export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      user: userAuth,
      resumeSkills: extractResumeSkills,
      [loginApi.reducerPath]: loginApi.reducer,
      [profileApi.reducerPath]: profileApi.reducer,
      [employerApi.reducerPath]: employerApi.reducer,
      [jobApi.reducerPath]: jobApi.reducer,
      [atsApi.reducerPath]: atsApi.reducer,
      [benchApi.reducerPath]: benchApi.reducer,
      [aiShortlistApi.reducerPath]: aiShortlistApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        loginApi.middleware,
        profileApi.middleware,
        employerApi.middleware,
        jobApi.middleware,
        atsApi.middleware,
        benchApi.middleware,
        aiShortlistApi.middleware,
      ),
    preloadedState,
  });
}

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: any;
  store?: ReturnType<typeof createTestStore>;
  withRouter?: boolean;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    withRouter = true,
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    const content = <Provider store={store}>{children}</Provider>;
    return withRouter ? <BrowserRouter>{content}</BrowserRouter> : content;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export * from '@testing-library/react';
export { renderWithProviders as render };