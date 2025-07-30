import { useState, useEffect, useRef, useCallback } from "react";
import { message } from "antd";
import instance from "../../../../axios";
import { useRouter } from "next/router";

// Configuration
const POLLING_INTERVAL = 30000; // Increased to 30 seconds
const MIN_UPDATE_INTERVAL = 10000; // Minimum 10 seconds between updates

export const useSliderRefresh = (
  sliderData,
  component,
  updateComponent,
  preview = false,
  isEditing = false
) => {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoPolling, setAutoPolling] = useState(false); // Default to false
  const [pollingError, setPollingError] = useState(null);
  const pollingIntervalRef = useRef(null);
  const lastUpdateRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Check if we're in page-builder context
  const isInPageBuilder = router.pathname.includes("/page-builder");

  // Completely disable auto-polling in page-builder context
  useEffect(() => {
    if (isInPageBuilder) {
      setAutoPolling(false);
      // Clear any existing intervals
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    } else {
      setAutoPolling(false);
    }
  }, [preview, isEditing, isInPageBuilder]);

  // Memoize the fetch function to avoid dependency issues
  const fetchSliderData = useCallback(
    async (silent = false) => {
      // Completely prevent updates when in page-builder context
      if (isInPageBuilder) {
        console.log("🔄 Skipping slider refresh - in page-builder context");
        return;
      }

      // Prevent updates during editing to avoid losing draft state
      if (isEditing) {
        return;
      }

      // Only allow refresh in preview mode
      if (!preview) {
        return;
      }

      if (!sliderData?.id) {
        if (!silent) {
          message.warning("No slider ID available to refresh");
        }
        return;
      }

      // Check if we've already updated recently to prevent rapid updates
      const now = Date.now();
      if (
        lastUpdateRef.current &&
        now - lastUpdateRef.current < MIN_UPDATE_INTERVAL
      ) {
        console.log("🔄 Skipping slider update - too recent");
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

              try {
                updateComponent(updatedComponent);
                lastUpdateRef.current = now;
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
    [
      sliderData?.id,
      sliderData?.config,
      component,
      updateComponent,
      isEditing,
      preview,
      isInPageBuilder,
    ]
  );

  // Auto-polling effect - completely disabled in page-builder context
  useEffect(() => {
    // Always disable auto-refresh by default
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    // Completely disable auto-polling in page-builder context
    if (isInPageBuilder) {
      console.log("🔄 Auto-polling disabled - in page-builder context");
      return;
    }

    // Only enable if explicitly requested AND in preview mode AND not editing AND not in page-builder
    if (
      autoPolling &&
      preview &&
      !isEditing &&
      sliderData?.id &&
      !isInPageBuilder
    ) {
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
    }
  }, [
    autoPolling,
    sliderData?.id,
    preview,
    isEditing,
    fetchSliderData,
    isInPageBuilder,
  ]);

  // Manual refresh function - also disabled in page-builder context
  const handleManualRefresh = useCallback(async () => {
    if (isInPageBuilder) {
      console.log("🔄 Manual refresh disabled - in page-builder context");
      return;
    }
    await fetchSliderData(false);
  }, [fetchSliderData, isInPageBuilder]);

  return {
    isRefreshing,
    lastUpdated,
    autoPolling,
    setAutoPolling,
    pollingError,
    handleManualRefresh,
  };
};
