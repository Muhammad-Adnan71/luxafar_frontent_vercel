import React, { Suspense } from "react";
import BespokeBecomePartner from "../components/bespokeBecomepartner";

function SearchBarFallback() {
  return <>Loading...</>;
}
function BespokeBecomePartnerPage() {
  return (
    <Suspense fallback={<SearchBarFallback />}>
      <BespokeBecomePartner />
    </Suspense>
  );
}

export default BespokeBecomePartnerPage;
