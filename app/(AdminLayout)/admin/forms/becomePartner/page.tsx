import React, { Suspense } from "react";
import BecomePartnerPage from "../components/becomePartner";
function SearchBarFallback() {
  return <>Loading...</>;
}
function BecomePartner() {
  return (
    <Suspense fallback={<SearchBarFallback />}>
      <BecomePartnerPage />
    </Suspense>
  );
}

export default BecomePartner;
