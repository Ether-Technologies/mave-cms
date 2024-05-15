import React, { useEffect, useState } from "react";
import instance from "../axios";
import CounterCards from "../components/dashboard/CounterCards";
import UserStat from "../components/dashboard/UserStat";
import SiteStat from "../components/dashboard/SiteStat";
import LatestEvents from "../components/dashboard/LatestEvents";
import SiteSpeed from "../components/dashboard/SiteSpeed";

const index = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        pages_response,
        media_response,
        menus_response,
        navbars_response,
        sliders_response,
        cards_response,
        pressrelease_response,
        events_response,
        forms_response,
        footers_response,
      ] = await Promise.all([
        instance.get("/pages"),
        instance.get("/media"),
        instance.get("/menus"),
        instance.get("/navbars"),
        instance.get("/sliders"),
        instance.get("/cards"),
        instance.get("/press_release"),
        instance.get("/events"),
        instance.get("/forms"),
        instance.get("/footers"),
      ]);

      setData({
        pages: pages_response.data,
        media: media_response.data,
        menus: menus_response.data,
        navbars: navbars_response.data,
        sliders: sliders_response.data,
        cards: cards_response.data,
        pressreleases: pressrelease_response.data,
        events: events_response.data,
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
  }, []);

  // console.log("Data: ", data);

  return (
    <>
      <div className="ViewContainer">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            marginBottom: "6rem",
            gap: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
            }}
          >
            <CounterCards />
            <UserStat />
            <SiteStat />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
            }}
          >
            <LatestEvents />
            <SiteSpeed />
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
