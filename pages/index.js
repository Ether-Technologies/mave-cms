import React, { useEffect, useState } from "react";
import instance from "../axios";
import { cachedApiCall } from "../utils/apiUtils";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import StatsOverview from "../components/dashboard/StatsOverview";
import PerformanceInsights from "../components/dashboard/PerformanceInsights";
import TrendingContent from "../components/dashboard/TrendingContent";
import SeoInsights from "../components/dashboard/SeoInsights";
import ContentActivity from "../components/dashboard/ContentActivity";
import ContentCalendar from "../components/dashboard/ContentCalendar";
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
    <main className="mavecontainer">
      <div className="flex flex-col gap-6">
        {/* Quick Actions */}
        <WelcomeCard userData={userData} />

        {/* Stats Overview */}
        <StatsOverview data={data} loading={loading} />

        {/* Performance and Trending Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          <PerformanceInsights />
          <TrendingContent />
        </div>

        {/* SEO Insights */}
        <SeoInsights />

        {/* Content Activity and Calendar */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ContentActivity />
          </div>
          <div>
            <ContentCalendar />
          </div>
        </div>

        {/* Additional Dashboard Components */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UserStat userData={userData} />
          <SiteStat data={data} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LatestEvents data={data} />
          <SiteSpeed />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Storage data={data} />
          <AverageRequests />
        </div> */}
      </div>
    </main>
  );
};

export default index;
