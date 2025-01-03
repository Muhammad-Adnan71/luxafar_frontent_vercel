import React, { Suspense } from "react";
import BespokePage from "../../components/bespoke";

function SearchBarFallback() {
  return <>Loading...</>;
}

function Bespoke() {
  return (
    <Suspense fallback={<SearchBarFallback />}>
      <BespokePage />
    </Suspense>
  );
}

export default Bespoke;
