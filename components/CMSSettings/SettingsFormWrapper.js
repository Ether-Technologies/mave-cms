// components/CMSSettings/SettingsFormWrapper.js

import React from "react";
import GeneralSettings from "./GeneralSettings";
import SEOSettings from "./SEOSettings";
import ContentSettings from "./ContentSettings";
import SecuritySettings from "./SecuritySettings";
import EmailSettings from "./EmailSettings";
import NotificationSettings from "./NotificationSettings";
import BackupSettings from "./BackupSettings";
import CacheSettings from "./CacheSettings";
import PerformanceSettings from "./PerformanceSettings";
import AnalyticsSettings from "./AnalyticsSettings";
import PaymentSettings from "./PaymentSettings";
import APISettings from "./APISettings";
import IPWhitelistSettings from "./IPWhitelistSettings";
import LicenseSettings from "./LicenseSettings";
import settingsConfig from "./settingsConfig.json";

// Component mapping for different setting types
const settingComponents = {
  allowed_ips: IPWhitelistSettings,
  mave_license: LicenseSettings,
  "general-settings": GeneralSettings,
  "seo-settings": SEOSettings,
  "content-settings": ContentSettings,
  "security-settings": SecuritySettings,
  "email-settings": EmailSettings,
  "notification-settings": NotificationSettings,
  "backup-settings": BackupSettings,
  "cache-settings": CacheSettings,
  "performance-settings": PerformanceSettings,
  "analytics-settings": AnalyticsSettings,
  "payment-settings": PaymentSettings,
  "api-settings": APISettings,
};

const SettingsFormWrapper = ({ type, config, id }) => {
  // Get default configuration from JSON
  const defaultConfig = settingsConfig[type] || {};

  // Merge provided config with defaults
  const mergedConfig = {
    ...defaultConfig,
    ...config,
    fields: {
      ...defaultConfig.fields,
      ...(typeof config === "object" && !Array.isArray(config)
        ? config.fields || {}
        : {}),
    },
  };

  // Handle array config (like allowed_ips)
  if (Array.isArray(config)) {
    mergedConfig.fields.ips = { value: config };
  }

  // Get the appropriate component for the setting type
  const SettingComponent = settingComponents[type];

  if (!SettingComponent) {
    return (
      <div className="p-4 text-center text-gray-500">
        Unknown Settings Type: {type}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        {defaultConfig.name ||
          config.name ||
          type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
      </h2>
      {defaultConfig.description && (
        <p className="text-gray-600 mb-4">{defaultConfig.description}</p>
      )}
      <SettingComponent config={mergedConfig} id={id} />
    </div>
  );
};

export default SettingsFormWrapper;
