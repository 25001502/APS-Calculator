import { Outlet } from "react-router";

export function Root() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full min-h-screen max-w-6xl bg-card shadow-none md:shadow-lg">
        <Outlet />
      </div>
    </div>
  );
}
