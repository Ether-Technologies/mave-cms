import { useState, useEffect, useRef, useCallback } from "react";
import { message } from "antd";
import instance from "../../../../axios";

// Configuration
const POLLING_INTERVAL = 30000; // 30 seconds

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
  const lastDataRef = useRef(null);

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

        const response = await instance.get(`/sliders/${sliderData.id}`);

        if (response.status === 200) {
          const updatedSlider = response.data;

          // Check if there were actual changes using ref to avoid infinite loops
          const currentDataString = JSON.stringify(component._mave);
          const hasChanges = currentDataString !== lastDataRef.current;

          if (hasChanges) {
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

            updateComponent(updatedComponent);
            setLastUpdated(new Date());
            lastDataRef.current = JSON.stringify(updatedSlider);

            if (!silent) {
              message.success("Slider data updated successfully");
            }
          } else if (!silent) {
            message.info("Slider data is up to date");
          }
        }
      } catch (error) {
        console.error("Error refreshing slider data:", error);
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
    [sliderData?.id, sliderData?.config, component.id, updateComponent]
  );

  // Initialize lastDataRef when component data changes
  useEffect(() => {
    if (component._mave) {
      lastDataRef.current = JSON.stringify(component._mave);
    }
  }, [component._mave]);

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

    // Set up polling interval (30 seconds)
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
