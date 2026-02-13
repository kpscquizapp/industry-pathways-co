import { configureStore } from "@reduxjs/toolkit";
import userAuth from "./slices/userAuth";
import extractResumeSkills from "./slices/extractResumeSkills";
import { loginApi } from "./queries/loginApi";
import { profileApi } from "./queries/profileApi";
import { jobApi } from "./queries/jobApi";
import { atsApi } from "./queries/atsApi";
import { benchApi } from "./queries/benchApi";

const store = configureStore({
  reducer: {
    user: userAuth,
    resumeSkills: extractResumeSkills,
    [loginApi.reducerPath]: loginApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [jobApi.reducerPath]: jobApi.reducer,
    [atsApi.reducerPath]: atsApi.reducer,
    [benchApi.reducerPath]: benchApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      loginApi.middleware,
      profileApi.middleware,
      jobApi.middleware,
      atsApi.middleware,
      benchApi.middleware,
    ),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
