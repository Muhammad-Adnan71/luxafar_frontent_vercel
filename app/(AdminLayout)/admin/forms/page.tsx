import React, { Suspense } from "react";
import FormsPage from "./components/formsPage";

function SearchBarFallback() {
  return <>Loading...</>;
}
function Forms() {
  return (
    <Suspense fallback={<SearchBarFallback />}>
      <FormsPage />
    </Suspense>
  );
}

export default Forms;
