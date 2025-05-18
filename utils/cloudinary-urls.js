export const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  return parts.slice(-2).join('/').split('.')[0]; // folder/name
};
