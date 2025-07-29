import { useState, useEffect, useRef, useCallback } from "react";
import { message } from "antd";
import instance from "../../../../axios";

// Configuration
const POLLING_INTERVAL = 10000; // 10 seconds

export const useSliderRefresh = (
  sliderData,
  component,
  updateComponent,
  preview = false,
  isEditing = false // Add isEditing parameter to prevent updates during editing
) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoPolling, setAutoPolling] = useState(false); // Default to false - only enable in preview mode
  const [pollingError, setPollingError] = useState(null);
  const pollingIntervalRef = useRef(null);
  const lastUpdateRef = useRef(null);

  // Disable auto-polling by default - only enable when explicitly requested
  useEffect(() => {
    setAutoPolling(false);
  }, [preview, isEditing]);

  // Memoize the fetch function to avoid dependency issues
  const fetchSliderData = useCallback(
    async (silent = false) => {
      // Prevent updates during editing to avoid losing draft state
      if (isEditing) {
        console.log("🔄 Skipping slider refresh - component is being edited");
        return;
      }

      // Only allow refresh in preview mode
      if (!preview) {
        console.log("🔄 Skipping slider refresh - not in preview mode");
        return;
      }

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
              // Check if we've already updated recently to prevent rapid updates
              const now = Date.now();
              if (lastUpdateRef.current && now - lastUpdateRef.current < 5000) {
                console.log("🔄 Skipping update - too recent");
                return;
              }

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
    ]
  );

  // Auto-polling effect - only when explicitly enabled and in preview mode
  useEffect(() => {
    // Always disable auto-refresh by default
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    // Only enable if explicitly requested AND in preview mode AND not editing
    if (autoPolling && preview && !isEditing && sliderData?.id) {
      console.log("🔄 Slider auto-refresh enabled - starting interval");
      setPollingError(null);

      // Set up polling interval (10 seconds)
      pollingIntervalRef.current = setInterval(() => {
        fetchSliderData(true);
      }, POLLING_INTERVAL);

      return () => {
        console.log("🔄 Slider auto-refresh disabled - cleaning up interval");
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      };
    } else {
      console.log(
        "🔄 Slider auto-refresh disabled - not enabled or not in preview mode"
      );
    }
  }, [autoPolling, sliderData?.id, preview, isEditing, fetchSliderData]);

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
