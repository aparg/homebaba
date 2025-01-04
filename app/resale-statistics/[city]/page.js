import React from "react";
import { getStatistics } from "../../_resale-api/getStatistics";
import capitalizeFirstLetter from "@/helpers/capitalizeFirstLetter";
import { houseType } from "@/constant";
import { getSalesData } from "@/app/_resale-api/getSalesData";

const page = async ({ params }) => {
  const propertyStats = {};
  const propertyTypes = Object.values(houseType)
    .map((obj) => obj.value)
    .filter((value) => value !== null);

  const averagePromises = propertyTypes.map(async (propertyType) => {
    const statistics = await getStatistics({
      city: capitalizeFirstLetter(params?.city),
      propertyType: propertyType,
    });
    return { propertyType, statistics };
  });

  const totalPropertiesCount = await getStatistics({
    city: capitalizeFirstLetter(params?.city),
  });
  const totalSoldCount = await getStatistics({
    city: capitalizeFirstLetter(params?.city),
    sold: true,
  });

  const results = await Promise.all(averagePromises);

  results.forEach(({ propertyType, statistics }) => {
    if (!propertyStats[propertyType]) {
      propertyStats[propertyType] = {};
    }
    propertyStats[propertyType]["average"] = statistics.avg;
    propertyStats[propertyType]["totalCount"] = statistics.totalCount;
  });
  const grandTotal = results.reduce((acc, obj) => acc + obj.totalCount, 0);
  const lastMonthName = new Date(
    new Date().setMonth(new Date().getMonth() - 1)
  ).toLocaleString("default", { month: "long" });
  return (
    <div className="relative max-w-[90%] mx-auto py-20">
      <div
        className="absolute inset-0"
        // style={{
        //   backgroundImage: "url(/maple-leaf.svg)",
        //   backgroundRepeat: "repeat",
        //   backgroundSize: "50px 50px",
        //   filter: "opacity(0.1)",
        //   zIndex: -1,
        // }}
      />
      <div className="flex">
        <img src="/maple-leaf.svg" className="w-4 h-4 mr-2"></img>
        <h2 className="tracking-wider font-semibold uppercase">
          HOMEBABA DATA INTELLIGENCE
        </h2>
      </div>
      <h1 className="font-bold my-4 text-3xl">
        Property Statistics for {capitalizeFirstLetter(params?.city)} for last
        one month
      </h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-800 uppercase text-sm leading-normal">
            <th className="py-3 px-6 border-b border-gray-300 text-left">
              Property Type
            </th>
            <th className="py-3 px-6 border-b border-gray-300 text-left">
              Average Price
            </th>
            <th className="py-3 px-6 border-b border-gray-300 text-left">
              Total Count
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {Object.entries(propertyStats).map(([propertyType, stats]) => (
            <tr
              key={propertyType}
              className="border-b border-gray-300 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left">{propertyType}</td>
              <td className="py-3 px-6 text-left">
                ${stats.average.toFixed(2)}
              </td>
              <td className="py-3 px-6 text-left">{stats.totalCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-8 text-lg">
        {/* Last month's data */}
        Total properties listed from {lastMonthName}:{" "}
        <span className="text-black font-bold">
          {totalPropertiesCount.totalCount}
        </span>
      </p>
      <p className="mt-1 text-lg">
        {/* Last month's data */}
        Total properties listed from {lastMonthName}:{" "}
        <span className="text-black font-bold">
          {totalSoldCount.totalCount}
        </span>
      </p>
    </div>
  );
};

export default page;
