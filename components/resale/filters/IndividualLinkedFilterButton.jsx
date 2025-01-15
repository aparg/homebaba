import { generateURL } from "@/helpers/generateResaleURL";
import Link from "next/link";
import { useState } from "react";

export const IndividualLinkedFilterButton = ({
  options,
  name,
  value,
  handleFilterChange,
  city,
  type,
}) => {
  const [activeFilter, setActiveFilter] = useState(value);

  const isActive = (key) => {
    const foundSalesLease = options.find((option) => option === key);
    return foundSalesLease === activeFilter;
  };

  const handleClick = (name, option) => {
    setActiveFilter(option);
    handleFilterChange(name, option);
  };

  return (
    <div className="inline-flex sm:mr-4 flex-wrap gap-y-2">
      {options.map((option, index) => {
        return (
          <div
            key={index}
            className={`mx-[2px] px-1 sm:px-3 py-1 cursor-pointer text-nowrap text-xs sm:text-sm h-[28px] leading-[1.2rem] sm:leading-normal sm:h-[34px] flex justify-content-center align-items-center rounded-full hover:shadow-lg border-[2px] ${
              isActive(option)
                ? `border-black! text-white bg-black`
                : "border-gray-filter"
            }`}
            // onClick={() => handleClick(name, option)}
            // style={{ border: "2px solid #e5e7eb" }}
          >
            <Link
              href={generateURL({
                saleLeaseVal: option,
                cityVal: city,
                houseTypeVal: type,
              })}
            >
              {option}
            </Link>
          </div>
        );
      })}
    </div>
  );
};
