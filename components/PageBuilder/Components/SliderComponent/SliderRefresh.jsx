import { useState, useEffect, useRef, useCallback } from "react";
import { message } from "antd";
import instance from "../../../../axios";

// Configuration
const POLLING_INTERVAL = 10000; // 10 seconds

export const useSliderRefresh = (
  sliderData,
  component,
  updateComponent,
  preview = false
) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoPolling, setAutoPolling] = useState(true);
  const [pollingError, setPollingError] = useState(null);
  const pollingIntervalRef = useRef(null);

  // Memoize the fetch function to avoid dependency issues
  const fetchSliderData = useCallback(
    async (silent = false) => {
      if (!sliderData?.id) {
        if (!silent) {
          message.warning("No slider ID available to refresh");
        }
        return;
      }

      try {
        if (!silent) {
          setIsRefreshing(true);
        }
        setPollingError(null);

        // Fetch all sliders and find the specific one by ID
        const response = await instance.get("/sliders");

        if (response.status === 200 && Array.isArray(response.data)) {
          const allSliders = response.data;
          const updatedSlider = allSliders.find((s) => s.id === sliderData.id);

          if (updatedSlider) {
            // Check if there are actual changes
            const currentMediaIds = component._mave?.media_ids || [];
            const newMediaIds = updatedSlider.media_ids || [];
            const hasChanges =
              JSON.stringify(currentMediaIds) !== JSON.stringify(newMediaIds);

            if (hasChanges) {
              // Always update the component with fresh data
              const updatedComponent = {
                ...component,
                _mave: {
                  ...updatedSlider,
                  config: sliderData.config || {
                    autoplay: true,
                    dots: false,
                    effect: "scroll",
                    speed: 500,
                    height: 400,
                  },
                },
                id: updatedSlider.id,
              };

              // Test if updateComponent is working
              try {
                updateComponent(updatedComponent);
              } catch (error) {
                console.error("❌ Error calling updateComponent:", error);
              }

              setLastUpdated(new Date());

              if (!silent) {
                message.success("Slider data updated successfully");
              }
            } else {
              if (!silent) {
                message.info("Slider data is up to date");
              }
            }
          } else {
            if (!silent) {
              message.error("Slider not found");
            }
          }
        } else {
          if (!silent) {
            message.error("Invalid response format");
          }
        }
      } catch (error) {
        setPollingError("Failed to refresh slider data");
        if (!silent) {
          message.error("Failed to refresh slider data");
        }
      } finally {
        if (!silent) {
          setIsRefreshing(false);
        }
      }
    },
    [sliderData?.id, sliderData?.config, component, updateComponent]
  );

  // Auto-polling effect
  useEffect(() => {
    if (!autoPolling || !sliderData?.id || preview) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    // Clear any existing errors when starting polling
    setPollingError(null);

    // Set up polling interval (10 seconds)
    pollingIntervalRef.current = setInterval(() => {
      fetchSliderData(true);
    }, POLLING_INTERVAL);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [autoPolling, sliderData?.id, preview, fetchSliderData]);

  // Manual refresh function
  const handleManualRefresh = useCallback(async () => {
    await fetchSliderData(false);
  }, [fetchSliderData]);

  return {
    isRefreshing,
    lastUpdated,
    autoPolling,
    setAutoPolling,
    pollingError,
    handleManualRefresh,
  };
};
