import LoadingSpinner from "@/components/ui/loader";
import React from "react";

const LoadingPage = () => {
  return (
    <div className="flex-center h-screen">
      <LoadingSpinner className="h-12 w-12" />
    </div>
  );
};

export default LoadingPage;
