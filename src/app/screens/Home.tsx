import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Calculator, School, GitCompare, Info, Search, Sparkles } from "lucide-react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { BottomNav } from "../components/BottomNav";

const quickActions = [
  {
    icon: Calculator,
    title: "Calculate APS",
    description: "Enter your marks",
    path: "/calculate",
    gradient: "from-primary to-primary/80",
  },
  {
    icon: School,
    title: "View Universities",
    description: "Browse options",
    path: "/matches",
    gradient: "from-secondary to-secondary/80",
  },
  {
    icon: GitCompare,
    title: "Compare",
    description: "Side by side",
    path: "/compare",
    gradient: "from-info to-info/80",
  },
];

const featuredUniversities = [
  { id: 1, name: "University of Cape Town", aps: "35-42", province: "Western Cape" },
  { id: 2, name: "University of Pretoria", aps: "28-38", province: "Gauteng" },
  { id: 3, name: "Stellenbosch University", aps: "32-40", province: "Western Cape" },
  { id: 4, name: "University of Witwatersrand", aps: "30-40", province: "Gauteng" },
];

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24 md:pt-20 md:pb-10">
      <div className="bg-gradient-to-br from-primary via-primary/95 to-secondary/80 text-white px-6 pt-12 pb-8 rounded-b-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl mb-2">Welcome back!</h1>
          <p className="text-white/80">Ready to explore your opportunities?</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search universities..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </motion.div>
      </div>

      <div className="px-6 -mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card
                  hover
                  onClick={() => navigate(action.path)}
                  className="p-4 text-center"
                >
                  <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-sm mb-1">{action.title}</h3>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                <Info size={20} className="text-accent-foreground" />
              </div>
              <div>
                <h3 className="mb-1">APS Quick Tip</h3>
                <p className="text-sm text-muted-foreground">
                  Your APS is calculated from your 6 best subjects. Make sure to include your Home Language and at least 4 other subjects.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl">Featured Universities</h2>
            <button
              onClick={() => navigate("/matches")}
              className="text-primary text-sm hover:underline"
            >
              View all
            </button>
          </div>

          <div className="space-y-3">
            {featuredUniversities.map((uni, index) => (
              <motion.div
                key={uni.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <Card hover onClick={() => navigate(`/university/${uni.id}`)}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                      <School size={24} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="truncate mb-1">{uni.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        APS: {uni.aps} • {uni.province}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 text-center">
            <Sparkles size={32} className="text-secondary mx-auto mb-3" />
            <h3 className="mb-2">Haven't calculated your APS yet?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start your university journey by calculating your Admission Point Score
            </p>
            <Button
              onClick={() => navigate("/calculate")}
              variant="success"
              fullWidth
            >
              Calculate Now
            </Button>
          </Card>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
