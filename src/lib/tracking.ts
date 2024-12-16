export const trackClick = (productId: string) => {
  const clicks = JSON.parse(localStorage.getItem("productClicks") || "{}");
  clicks[productId] = (clicks[productId] || 0) + 1;
  localStorage.setItem("productClicks", JSON.stringify(clicks));
};

export const getClickCount = (productId: string): number => {
  const clicks = JSON.parse(localStorage.getItem("productClicks") || "{}");
  return clicks[productId] || 0;
};