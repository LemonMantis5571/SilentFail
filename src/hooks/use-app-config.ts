"use client";

import { useState, useEffect } from "react";

interface AppConfig {
  appUrl: string;
}

const defaultConfig: AppConfig = {
  appUrl: "",
};

let cachedConfig: AppConfig | null = null;

/**
 * Hook to get runtime app config.
 * Fetches from /api/config on first load and caches the result.
 */
export function useAppConfig() {
  const [config, setConfig] = useState<AppConfig>(cachedConfig || defaultConfig);
  const [isLoading, setIsLoading] = useState(!cachedConfig);

  useEffect(() => {
    if (cachedConfig) {
      setConfig(cachedConfig);
      setIsLoading(false);
      return;
    }

    fetch("/api/config")
      .then((res) => res.json())
      .then((data: AppConfig) => {
        cachedConfig = data;
        setConfig(data);
        setIsLoading(false);
      })
      .catch(() => {
        const fallback = { appUrl: window.location.origin };
        cachedConfig = fallback;
        setConfig(fallback);
        setIsLoading(false);
      });
  }, []);

  return { config, isLoading };
}
