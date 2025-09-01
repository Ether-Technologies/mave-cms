// utils/googleDrive.js

/**
 * Extracts video ID from Google Drive URL and converts to embed URL
 * Supports various Google Drive URL formats with multiple fallback options
 */
export const getGoogleDriveEmbedUrl = (url) => {
  if (!url) return null;

  // Pattern 1: https://drive.google.com/file/d/\{fileId\}/view
  const fileViewMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)\/view/);
  if (fileViewMatch) {
    const fileId = fileViewMatch[1];
    return {
      primary: `https://drive.google.com/file/d/${fileId}/preview`,
      fallback: `https://drive.google.com/uc?export=download&id=${fileId}`,
      direct: `https://drive.google.com/uc?export=view&id=${fileId}`,
      embedApi: `https://docs.google.com/file/d/${fileId}/preview`,
      fileId: fileId
    };
  }

  // Pattern 2: https://drive.google.com/open\?id\=\{fileId\}
  const openMatch = url.match(/\/open\?id=([a-zA-Z0-9-_]+)/);
  if (openMatch) {
    const fileId = openMatch[1];
    return {
      primary: `https://drive.google.com/file/d/${fileId}/preview`,
      fallback: `https://drive.google.com/uc?export=download&id=${fileId}`,
      direct: `https://drive.google.com/uc?export=view&id=${fileId}`,
      embedApi: `https://docs.google.com/file/d/${fileId}/preview`,
      fileId: fileId
    };
  }

  // Pattern 3: https://drive.google.com/uc\?id\=\{fileId\}
  const ucMatch = url.match(/\/uc\?id=([a-zA-Z0-9-_]+)/);
  if (ucMatch) {
    const fileId = ucMatch[1];
    return {
      primary: `https://drive.google.com/file/d/${fileId}/preview`,
      fallback: `https://drive.google.com/uc?export=download&id=${fileId}`,
      direct: `https://drive.google.com/uc?export=view&id=${fileId}`,
      embedApi: `https://docs.google.com/file/d/${fileId}/preview`,
      fileId: fileId
    };
  }

  // Pattern 4: Direct file ID (if user just pastes the ID)
  // Google Drive file IDs are typically 33 characters long and contain alphanumeric characters, hyphens, and underscores
  if (url.match(/^[a-zA-Z0-9-_]{20,}$/)) {
    return {
      primary: `https://drive.google.com/file/d/${url}/preview`,
      fallback: `https://drive.google.com/uc?export=download&id=${url}`,
      direct: `https://drive.google.com/uc?export=view&id=${url}`,
      embedApi: `https://docs.google.com/file/d/${url}/preview`,
      fileId: url
    };
  }

  return null;
};

/**
 * Validates if a URL is a Google Drive URL
 */
export const isGoogleDriveUrl = (url) => {
  if (!url) return false;
  
  const googleDrivePatterns = [
    /drive\.google\.com\/file\/d\/[a-zA-Z0-9-_]+\/view/,
    /drive\.google\.com\/open\?id=[a-zA-Z0-9-_]+/,
    /drive\.google\.com\/uc\?id=[a-zA-Z0-9-_]+/,
    /^[a-zA-Z0-9-_]{20,}$/
  ];

  return googleDrivePatterns.some(pattern => pattern.test(url));
};

/**
 * Gets the file ID from a Google Drive URL
 */
export const getGoogleDriveFileId = (url) => {
  if (!url) return null;

  const fileViewMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)\/view/);
  if (fileViewMatch) return fileViewMatch[1];

  const openMatch = url.match(/\/open\?id=([a-zA-Z0-9-_]+)/);
  if (openMatch) return openMatch[1];

  const ucMatch = url.match(/\/uc\?id=([a-zA-Z0-9-_]+)/);
  if (ucMatch) return ucMatch[1];

  // If it's just a file ID
  if (url.match(/^[a-zA-Z0-9-_]{20,}$/)) return url;

  return null;
};

/**
 * Gets alternative embed URLs for Google Drive videos
 */
export const getGoogleDriveAlternativeUrls = (fileId) => {
  if (!fileId) return null;
  
  return {
    embed: `https://drive.google.com/file/d/${fileId}/preview`,
    download: `https://drive.google.com/uc?export=download&id=${fileId}`,
    view: `https://drive.google.com/uc?export=view&id=${fileId}`,
    direct: `https://drive.google.com/uc?id=${fileId}`,
    // Alternative approach using Google Drive's embed API
    embedApi: `https://docs.google.com/file/d/${fileId}/preview`
  };
};
