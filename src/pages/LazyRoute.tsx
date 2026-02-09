import { Suspense } from "react";
import LazyErrorBoundary from "./LazyErrorBoundary";
import BarLoader from "@/components/loader/BarLoader";

export const LazyRoute = ({ element }: { element: React.ReactNode }) => (
  <LazyErrorBoundary>
    <Suspense fallback={<BarLoader />}>{element}</Suspense>
  </LazyErrorBoundary>
);
