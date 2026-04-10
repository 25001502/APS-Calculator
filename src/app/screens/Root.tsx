import { Outlet } from "react-router";

export function Root() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto min-h-screen bg-card shadow-lg">
        <Outlet />
      </div>
    </div>
  );
}
