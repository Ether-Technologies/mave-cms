import React, { useEffect, useState } from "react";
import instance from "../axios";
import { cachedApiCall } from "../utils/apiUtils";
import { useGlobalRefresh } from "../src/context/MenuRefreshContext";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import StatsOverview from "../components/dashboard/StatsOverview";
import ContentInventory from "../components/dashboard/ContentInventory";
import TrendingContent from "../components/dashboard/TrendingContent";
import ContentActivity from "../components/dashboard/ContentActivity";
import Storage from "../components/dashboard/Storage";
import { asList } from "../components/dashboard/dashboardUtils";

const emptyData = {
  pages: [],
  media: [],
  menus: [],
  navbars: [],
  sliders: [],
  cards: [],
  forms: [],
  footers: [],
};

const Index = () => {
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const fetchData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      const force = { force: forceRefresh };
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
        cachedApiCall("pages", () => instance.get("/pages"), undefined, force),
        cachedApiCall("media", () => instance.get("/media"), undefined, force),
        cachedApiCall("menus", () => instance.get("/menus"), undefined, force),
        cachedApiCall("navbars", () => instance.get("/navbars"), undefined, force),
        cachedApiCall("sliders", () => instance.get("/sliders"), undefined, force),
        cachedApiCall("cards", () => instance.get("/cards"), undefined, force),
        cachedApiCall("forms", () => instance.get("/forms"), undefined, force),
        cachedApiCall("footers", () => instance.get("/footers"), undefined, force),
      ]);

      setData({
        pages: asList(pages_response.data),
        media: asList(media_response.data),
        menus: asList(menus_response.data),
        navbars: asList(navbars_response.data),
        sliders: asList(sliders_response.data),
        cards: asList(cards_response.data),
        forms: asList(forms_response.data),
        footers: asList(footers_response.data),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const storedUser = localStorage.getItem("user");
    const storedOrganization = localStorage.getItem("organization");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const parsedOrganization = storedOrganization
        ? JSON.parse(storedOrganization)
        : parsedUser.organization || null;
      setUserData({ ...parsedUser, organization: parsedOrganization });
    }
  }, []);

  useGlobalRefresh(() => fetchData(true));

  return (
    <main className="mavecontainer">
      <div className="flex flex-col gap-6">
        <WelcomeCard userData={userData} />
        <StatsOverview data={data} loading={loading} />

        <div className="grid gap-6 lg:grid-cols-2">
          <ContentInventory data={data} />
          <TrendingContent pages={data.pages} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ContentActivity data={data} />
          </div>
          <Storage media={data.media} />
        </div>
      </div>
    </main>
  );
};

export default Index;
