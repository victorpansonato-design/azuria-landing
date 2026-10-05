import catalog from "./curadoria-artes.json";
export const directions = catalog.directions;
// The green burger is intentionally excluded from the entire public gallery.
export const artworks = catalog.entries.filter((work) => work.id !== "AZ088");
export type Artwork = (typeof artworks)[number];
export const initialIds = [
  "AZ001",
  "AZ037",
  "AZ030",
  "AZ064",
  "AZ095",
  "AZ066",
  "AZ005",
  "AZ038",
  "AZ061",
  "AZ078",
  "AZ067",
  "AZ082",
];
export const initialArtworks = initialIds.map(
  (id) => artworks.find((work) => work.id === id)!,
);
