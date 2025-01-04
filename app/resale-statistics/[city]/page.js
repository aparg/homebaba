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
      <div className="flex items-center">
        <img src="/maple-leaf.svg" className="w-4 h-4 mr-2"></img>
        <h2 className="tracking-wide font-semibold uppercase text-lg">
          HOMEBABA DATA INTELLIGENCE
        </h2>
      </div>

      <div className="my-6">
        <h2 className="tracking-wider font-light uppercase text-4xl text-red-500">
          {params?.city}
        </h2>
        <p className="tracking-tighter font-thin uppercase text-3xl mt-2">
          {lastMonthName}, {new Date().getFullYear()}
        </p>
      </div>
      {/* <h1 className="font-bold my-4 text-3xl">Property Statistics one month</h1> */}
      <table className="min-w-full bg-white border border-gray-300 my-10">
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
      <ul className="mt-8 text-lg list-disc list-inside">
        {/* Last month's data */}
        <li className="mb-2">
          <span className="font-semibold uppercase text-sm tracking-wider">
            Total Homes listed:
          </span>{" "}
          <span className="text-black font-bold text-sm tracking-wide">
            {totalPropertiesCount.totalCount}
          </span>
        </li>
        <li>
          <span className="font-semibold uppercase text-sm tracking-wider">
            Total Homes Sold:
          </span>{" "}
          <span className="text-black font-bold text-sm tracking-wide">
            {totalSoldCount.totalCount}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default page;
