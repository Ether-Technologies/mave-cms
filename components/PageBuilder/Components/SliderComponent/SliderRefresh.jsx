import { useState, useEffect, useRef, useCallback } from "react";
import { message } from "antd";
import instance from "../../../../axios";
import { useRouter } from "next/router";

const POLL_INTERVAL = 10000; // 10 seconds in page-builder

export const useSliderRefresh = (
  sliderData,
  component,
  updateComponent,
  preview = false,
  isEditing = false
) => {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing]   = useState(false);
  const [pollingError, setPollingError]   = useState(null);
  const [lastSynced,   setLastSynced]     = useState(null);
  const [hasUpdate,    setHasUpdate]      = useState(false);
  const intervalRef  = useRef(null);
  const mountedRef   = useRef(true);

  const isInPageBuilder = router.pathname.includes("/page-builder");
  const sliderId = component?.id || sliderData?.id;

  // fingerprint: detect real changes between two slider objects
  const fingerprint = (s) => {
    if (!s) return "";
    const mediaIds = (s.medias || []).map((m) => m.id).join(",");
    const cardIds  = (s.cards  || []).map((c) => c.id).join(",");
    return `${s.id}|${s.updated_at || ""}|${mediaIds}|${cardIds}`;
  };

  const fetchAndSync = useCallback(async (manual = false) => {
    if (!sliderId) return;

    if (manual) setIsRefreshing(true);
    setPollingError(null);

    try {
      const response = await instance.get("/sliders");
      if (!mountedRef.current) return;

      if (response.status === 200 && Array.isArray(response.data)) {
        const fresh = response.data.find((s) => s.id === sliderId);
        if (!fresh) {
          if (manual) message.warning("Slider not found on server.");
          return;
        }

        const currentFp = fingerprint(sliderData);
        const freshFp   = fingerprint(fresh);

        if (currentFp !== freshFp) {
          const updatedComponent = {
            ...component,
            _mave: {
              ...fresh,
              config:    sliderData?.config    || component._mave?.config,
              activeIds: sliderData?.activeIds || component._mave?.activeIds,
            },
            id: fresh.id,
          };
          updateComponent(updatedComponent);
          setLastSynced(new Date());
          setHasUpdate(true);
          setTimeout(() => setHasUpdate(false), 3000);
          if (manual) message.success("Slider synced with latest data.");
        } else {
          setLastSynced(new Date());
          if (manual) message.info("Slider is already up to date.");
        }
      }
    } catch (err) {
      if (mountedRef.current) {
        setPollingError("Sync failed");
        if (manual) message.error("Failed to sync slider data.");
      }
    } finally {
      if (mountedRef.current && manual) setIsRefreshing(false);
    }
  }, [sliderId, sliderData, component, updateComponent]);

  // Auto-poll only in page-builder
  useEffect(() => {
    mountedRef.current = true;

    if (isInPageBuilder && sliderId) {
      // initial fetch after mount
      fetchAndSync(false);
      intervalRef.current = setInterval(() => fetchAndSync(false), POLL_INTERVAL);
    }

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInPageBuilder, sliderId]);

  const handleManualRefresh = useCallback(() => {
    fetchAndSync(true);
  }, [fetchAndSync]);

  return { isRefreshing, pollingError, lastSynced, hasUpdate, handleManualRefresh };
};
