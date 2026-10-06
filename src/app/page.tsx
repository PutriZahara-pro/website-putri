import type { Metadata } from "next";
import HomeView from "./HomeView";

// Title, description and social preview come from the root layout.
// The canonical lives here, not in the layout, so other routes don't inherit "/".
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomeView />;
}
