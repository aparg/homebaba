"use client";
import { FilterOpenProvider } from "@/components/resale/FilterOpenContext";
import React from "react";

const layout = ({ children }) => {
  return (
    <FilterOpenProvider>
      <div className="max-w-[98%] mx-auto font-lausanne">{children}</div>;
    </FilterOpenProvider>
  );
};

export default layout;
