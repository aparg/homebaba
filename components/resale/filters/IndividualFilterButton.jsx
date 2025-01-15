import { useState } from "react";

export const IndividualFilterButton = ({
  options,
  name,
  value,
  handleFilterChange,
  filterObj,
  city,
  type,
}) => {
  const [activeFilter, setActiveFilter] = useState([]);
  const handleClick = (name, option) => {
    if (activeFilter.includes(option)) {
      const filteredActiveFilter = activeFilter.filter((opt) => opt !== option);
      setActiveFilter(filteredActiveFilter);
      handleFilterChange(name, filteredActiveFilter);
    } else {
      setActiveFilter([...activeFilter, option]);
      const filteredActiveFilter = [...activeFilter, filterObj[option]];
      handleFilterChange(name, filteredActiveFilter);
    }
  };

  return (
    <div className="inline-flex sm:justify-normal justify-center sm:mr-4 flex-wrap gap-y-2 py-2 sm:py-0">
      {options.map((option, index) => {
        return (
          <div
            key={index}
            className={`mx-[2px] px-2 sm:px-3  sm:h-[34px] py-1 cursor-pointer text-nowrap flex justify-content-center align-items-center rounded-full hover:shadow-lg text-xs sm:text-sm
              ${
                activeFilter.includes(option)
                  ? `border-black bg-black text-white`
                  : "border-[2px] border-gray-filter"
              }`}
            onClick={() => handleClick(name, option)}
            // style={{ border: "2px solid #e5e7eb" }}
          >
            {option}
          </div>
        );
      })}
    </div>
  );
};
