import { useEffect, useState } from "react";

export const useClientFilter = (salesData, filterState) => {
  const [data, setData] = useState(salesData);
  const [isClientFiltered, setIsClientFiltered] = useState(false);
  const clientFiltering = async () => {
    if (filterState.Basement.length > 0) {
      setIsClientFiltered(true);
      let filteredSalesData = salesData.filter((data) => {
        return filterState.Basement.every((basement) =>
          data.Basement.includes(basement)
        );
      });
      setData(filteredSalesData);
    } else {
      setIsClientFiltered(false);
      setData([]);
    }
  };
  useEffect(() => {
    console.log("Client filtering");
    clientFiltering();
  }, [filterState.Basement]);

  return [data, isClientFiltered];
};
