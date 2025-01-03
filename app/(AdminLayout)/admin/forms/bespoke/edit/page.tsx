import React, { Suspense } from "react";
import BespokeEdit from "../../components/bespokeEdit";

function SearchBarFallback() {
  return <>Loading...</>;
}

function BespokeEditPage() {
  return (
    <Suspense fallback={<SearchBarFallback />}>
      <BespokeEdit />
    </Suspense>
  );
}

export default BespokeEditPage;
