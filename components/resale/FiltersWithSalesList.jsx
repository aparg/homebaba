"use client";
import React, { useEffect, useMemo, useState } from "react";

import SalesList from "./SalesList";
import Filters from "./Filters";

//HELPERS
import capitalizeFirstLetter from "@/helpers/capitalizeFirstLetter";

//CONSTANT
import { bedCount, saleLease, houseType, washroomCount } from "@/constant";
import { getFilteredRetsData } from "@/app/_resale-api/getSalesData";
import useDeviceView from "@/helpers/useDeviceView";
import { isLocalStorageAvailable } from "@/helpers/checkLocalStorageAvailable";
import { ImSpinner } from "react-icons/im";
import HotListings from "./HotListings";
import PageSelector from "./PageSelector";
import Image from "next/image";
import { FadeLoader } from "react-spinners";
import { useClientFilter } from "@/hooks/use-client-filter";
// import formatCurrency from "@/helpers/formatCurrency";
// import FilterSubmit from "../FilterSubmit";

const FiltersWithSalesList = ({
  salesListData = [],
  INITIAL_LIMIT,
  city = undefined,
  requiredType = undefined,
  saleLeaseVal = undefined,
}) => {
  // const leadEmail = user?.emailAddresses[0].emailAddress;
  const saleLeaseFilterVal =
    saleLease[
      Object.keys(saleLease).find((val) => val === saleLeaseVal) || "sale"
    ]?.name || saleLease.sale.name;

  const houseTypeFilterVal =
    Object.values(houseType).find((val) => val.name === requiredType)?.value ||
    houseType.all.value;

  const initialState = {
    saleLease: saleLeaseFilterVal,
    bed: bedCount.any.value,
    priceRange: {
      min: 0,
      max: 0,
    },
    type: houseTypeFilterVal,
    Basement: [],
    washroom: washroomCount.any.value,
    priceDecreased: null,
    city: city,
  };

  const storedState = isLocalStorageAvailable()
    ? JSON.parse(window.localStorage.getItem("filterState"))
    : null;
  //if parameters are passed for house type or sale/lease rewrite property values for storedState
  if (storedState) {
    if (houseTypeFilterVal) storedState.type = houseTypeFilterVal;
    if (saleLeaseFilterVal) storedState.saleLease = saleLeaseFilterVal;
    if (city) storedState.city = city;
  }
  const [filterState, setFilterState] = useState(initialState);

  const [salesData, setSalesData] = useState(salesListData);
  const [clientFilteredData, isClientFiltered] = useClientFilter(
    salesData,
    filterState
  );
  const [offset, setOffset] = useState(0);
  const { isMobileView } = useDeviceView();
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(1); //the page that is selected

  const separateSalesData = (salesData) => {
    if (selected == 1) {
      // Get the current date and time
      const currentDate = new Date();

      // Calculate the date and time 24 hours ago
      const twentyFourHoursAgo = new Date(
        currentDate.getTime() - 24 * 60 * 60 * 1000
      );

      // Function to check if the data is from 24 hours ago
      const is24HoursAgo = (timestampSql) => {
        const timestampDate = new Date(timestampSql);
        return (
          timestampDate > twentyFourHoursAgo && timestampDate <= currentDate
        );
      };

      // Separate sales data for 24 hours ago and remaining days
      const hotSales = [];
      const remainingSales = [];

      salesData?.forEach((data) => {
        if (is24HoursAgo(data.OriginalEntryTimestamp) && hotSales.length < 5) {
          hotSales.push(data);
        } else {
          remainingSales.push(data);
        }
      });
      return { hotSales, remainingSales };
    } else {
      return { hotSales: [], remainingSales: salesData };
    }
  };

  const { hotSales, remainingSales } = useMemo(() => {
    if (isClientFiltered) {
      console.log("Client Filtered Data");
      return separateSalesData(clientFilteredData);
    } else return separateSalesData(salesData);
  }, [salesData, clientFilteredData]);

  //temporary solution for basement filtering

  const _getMergedHouseType = (state) => {
    const selectedHouseType = [state.type];
    return selectedHouseType;
  };

  const fetchFilteredData = async (
    params,
    limit = INITIAL_LIMIT,
    offset = 0
  ) => {
    const payload = {
      saleLease: Object.values(saleLease).find(
        (saleLeaseObj) => saleLeaseObj.name === params.saleLease
      )?.name,
      bed: params.bed,
      minListPrice: Number(params.priceRange?.min ?? 0),
      maxListPrice: Number(params.priceRange?.max ?? 0),
      houseType: _getMergedHouseType(params),
      Basement: params.Basement,
      washroom: params.washroom,
      priceDecreased: params.priceDecreased,
    };
    const queryParams = {
      limit: limit,
      offset: offset,
      city: capitalizeFirstLetter(city),
      ...payload,
    };
    setLoading(true);
    // console.log(payload);
    const filteredSalesData = await getFilteredRetsData(queryParams);

    setSalesData(filteredSalesData);
    if (!filteredSalesData?.length == 0) {
      setOffset(offset);
    }
    setLoading(false);
  };

  useEffect(() => {
    // store data in session storage whenever it changes
    if (isLocalStorageAvailable() && filterState) {
      window.localStorage.setItem("filterState", JSON.stringify(filterState));
      window.localStorage.setItem("selectedCity", capitalizeFirstLetter(city));
    }

    if (window !== undefined) {
      window.scrollY = 0;
    }
  }, [filterState]);

  useEffect(() => {
    //component can be loaded in three ways, either it is provided a pre-defined filter, have a stored state or

    fetchFilteredData(initialState, 20, selected * 20 - 20);
  }, [selected]);

  const homeText = !requiredType
    ? "Homes"
    : !requiredType?.toLowerCase().includes("house")
    ? "Homes"
    : "";

  const getTitle = () => {
    return (
      <>
        {[
          capitalizeFirstLetter(requiredType),
          homeText,
          capitalizeFirstLetter(saleLeaseVal)?.toLowerCase() == "for lease"
            ? "for Rent"
            : "for Sale",
        ].join(" ") + " "}{" "}
        in
        {city ? ` ${capitalizeFirstLetter(city)}` : ""}
      </>
    );
  };
  return (
    <>
      <div className="">
        <h1
          className={`font-extrabold text-2xl text-center sm:text-left ${
            isMobileView ? "pt-2" : "pt-2"
          }`}
        >
          100+ {getTitle()} | Homebaba.ca
        </h1>
        <h2
          className="text-sm mb-5 mt-1 text-center sm:text-left"
          style={isMobileView ? { fontSize: "0.9rem" } : {}}
        >
          500+ {capitalizeFirstLetter(city)}{" "}
          {capitalizeFirstLetter(requiredType) || ""} homes for{" "}
          {saleLeaseVal?.toLowerCase() == "lease" ? "Rent or Lease" : "sale"}.
          Book a showing for affordable homes with pools, finished basements,
          walkouts. Prices from $1 to $5,000,000. Open houses available.
        </h2>

        <div
          className="flex sticky top-[4rem] z-50 bg-white items-center w-full flex-wrap overflow-visible justify-center sm:justify-normal"
          id="filter"
        >
          <Filters {...{ filterState, setFilterState, fetchFilteredData }} />
        </div>

        {loading ? (
          <div className="w-[20px] mx-auto">
            <FadeLoader />
          </div>
        ) : salesData?.length > 0 || hotSales?.length > 0 ? (
          <>
            {selected === 1 && <HotListings salesData={hotSales} city={city} />}
            <div
              className={`${
                isMobileView ? "pt-1" : "pt-3"
              } grid grid-cols-2 md:grid-cols-4 xs:grid-cols-2 sm:grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-0 gap-x-2 gap-y-4 md:gap-x-2 sm:gap-y-[40px]`}
            >
              <SalesList
                {...{
                  city,
                  INITIAL_LIMIT,
                  salesData: remainingSales,
                  setSalesData,
                  offset,
                  setOffset,
                  filterState,
                }}
              />
            </div>
            <div className="flex justify-center mt-10">
              <PageSelector
                numberOfPages={40}
                batchSize={3}
                selected={selected}
                setSelected={setSelected}
              />
            </div>
          </>
        ) : (
          <div className="fs-4 text-center flex w-100 flex-col items-center">
            <Image
              src="/no-record-found.jpg"
              width="500"
              height="500"
              alt="no record found"
            />
            <p>No Records Found</p>
          </div>
        )}
      </div>
    </>
  );
};

export default FiltersWithSalesList;
