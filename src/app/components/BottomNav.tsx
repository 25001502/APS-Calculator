import { Home, Calculator, Bookmark, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { motion } from "motion/react";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: Calculator, label: "Calculate", path: "/calculate" },
    { icon: Bookmark, label: "Saved", path: "/saved" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-inset-bottom">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around px-2 py-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <motion.button
                key={item.path}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                  isActive ? "text-primary bg-primary/10" : "text-muted-foreground"
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-xs">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
