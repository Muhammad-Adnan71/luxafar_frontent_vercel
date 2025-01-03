import React, { Suspense } from "react";
import BespokeQuestions from "../../components/bespokeQuestions";

function SearchBarFallback() {
  return <>Loading...</>;
}
function BespokeQuestionsPage() {
  return (
    <Suspense fallback={<SearchBarFallback />}>
      <BespokeQuestions />
    </Suspense>
  );
}

export default BespokeQuestionsPage;
