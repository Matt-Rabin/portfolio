const SALE_CATEGORIES = [
  "Furniture",
  "Electronics",
  "Kitchen",
  "Clothing",
  "Books",
  "Sports & Gear",
  "Decor",
  "Other"
];
const SALE_CONDITIONS = ["Like New", "Good", "Fair", "For Parts"];
const SALE_PICKUP_WINDOWS = [
  {
    id: "now",
    label: "Available Now",
    sublabel: "Pick up ASAP",
    accent: "#c8f060"
  },
  {
    id: "july",
    label: "End of July",
    sublabel: "Available around July 31",
    accent: "#60c8f0"
  }
];

export { SALE_CATEGORIES as S, SALE_CONDITIONS as a, SALE_PICKUP_WINDOWS as b };
