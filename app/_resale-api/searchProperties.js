import { residential } from "./routes/fetchRoutes";

export const searchProperties = async (inputValue) => {
  const response = await fetch(
    "https://rets.api.ca/residential/Properties/$query".replace(
      "$query",
      "?$search="
    ) + inputValue
  );
  const searchedProperties = await response.json();
  return searchedProperties.results;
};
