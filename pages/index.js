import React, { useEffect, useState } from "react";
import instance from "../axios";
import { cachedApiCall } from "../utils/apiUtils";
import CounterCards from "../components/dashboard/CounterCards";
import UserStat from "../components/dashboard/UserStat";
import SiteStat from "../components/dashboard/SiteStat";
import LatestEvents from "../components/dashboard/LatestEvents";
import SiteSpeed from "../components/dashboard/SiteSpeed";
import Storage from "../components/dashboard/Storage";
import AverageRequests from "../components/dashboard/AverageRequests";

const index = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Use cached API calls to prevent excessive requests
      const [
        pages_response,
        media_response,
        menus_response,
        navbars_response,
        sliders_response,
        cards_response,
        forms_response,
        footers_response,
      ] = await Promise.all([
        cachedApiCall("pages", () => instance.get("/pages")),
        cachedApiCall("media", () => instance.get("/media")),
        cachedApiCall("menus", () => instance.get("/menus")),
        cachedApiCall("navbars", () => instance.get("/navbars")),
        cachedApiCall("sliders", () => instance.get("/sliders")),
        cachedApiCall("cards", () => instance.get("/cards")),
        cachedApiCall("forms", () => instance.get("/forms")),
        cachedApiCall("footers", () => instance.get("/footers")),
      ]);

      setData({
        pages: pages_response.data,
        media: media_response.data,
        menus: menus_response.data,
        navbars: navbars_response.data,
        sliders: sliders_response.data,
        cards: cards_response.data,
        forms: forms_response.data,
        footers: footers_response.data,
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    localStorage.getItem("user")
      ? setUserData(JSON.parse(localStorage.getItem("user")))
      : setUserData(null);
  }, []);

  // console.log("Data: ", data);

  return (
    <div className="mavecontainer">
      <CounterCards data={data} loading={loading} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <UserStat userData={userData} />
        <SiteStat data={data} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <LatestEvents data={data} />
        <SiteSpeed />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Storage data={data} />
        <AverageRequests />
      </div>
    </div>
  );
};

export default index;
