import React from "react";
import ProductCreateForm from "./components/ProductCreateForm";

const page = () => {
  return (
    <section className="">
      <h2 className="h2-bold">Create Product</h2>
      <div className="py-8">
        <ProductCreateForm />
      </div>
    </section>
  );
};

export default page;
