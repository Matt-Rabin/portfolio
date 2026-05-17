function readEnv(name) {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}
function getSaleConfig() {
  return {
    routeSlug: readEnv("SALE_ROUTE_SLUG"),
    venmoHandle: process.env.SALE_VENMO_HANDLE?.trim() || null,
    title: process.env.SALE_TITLE?.trim() || "mattslist",
    tagline: process.env.SALE_TAGLINE?.trim() || "Moving Sale"
  };
}

export { getSaleConfig as g };
