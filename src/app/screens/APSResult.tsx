import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Award, TrendingUp, School, CheckCircle2 } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";

interface APSData {
  name: string;
  mark: number;
  points: number;
}

export function APSResult() {
  const navigate = useNavigate();
  const [apsData, setApsData] = useState<APSData[]>([]);
  const [totalAPS, setTotalAPS] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("apsData");
    if (stored) {
      const data: APSData[] = JSON.parse(stored);
      const sorted = data.sort((a, b) => b.points - a.points).slice(0, 6);
      setApsData(sorted);
      setTotalAPS(sorted.reduce((sum, s) => sum + s.points, 0));
    } else {
      navigate("/calculate");
    }
  }, [navigate]);

  const getScoreMessage = (score: number) => {
    if (score >= 36) return { text: "Outstanding Achievement", variant: "success" as const, icon: Award };
    if (score >= 30) return { text: "Competitive Score", variant: "success" as const, icon: TrendingUp };
    if (score >= 24) return { text: "Good Standing", variant: "info" as const, icon: CheckCircle2 };
    if (score >= 18) return { text: "Room for Growth", variant: "warning" as const, icon: TrendingUp };
    return { text: "Keep Improving", variant: "warning" as const, icon: TrendingUp };
  };

  const scoreMessage = getScoreMessage(totalAPS);
  const MessageIcon = scoreMessage.icon;

  const handleViewMatches = () => {
    localStorage.setItem("userAPS", totalAPS.toString());
    navigate("/matches");
  };

  return (
    <div className="min-h-screen pb-8">
      <div className="bg-gradient-to-br from-primary via-primary/95 to-secondary/80 text-white px-6 pt-12 pb-16">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate("/home")} className="hover:opacity-70">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl">Your APS Result</h1>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 150, delay: 0.2 }}
          className="text-center"
        >
          <p className="text-white/80 mb-2">Your Total APS Score</p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-8xl mb-4 tracking-tight"
          >
            {totalAPS}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Badge variant={scoreMessage.variant} className="text-base px-4 py-2">
              <MessageIcon size={16} />
              {scoreMessage.text}
            </Badge>
          </motion.div>
        </motion.div>
      </div>

      <div className="px-6 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="mb-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                <School size={20} className="text-white" />
              </div>
              <div>
                <h3 className="mb-1">What does this mean?</h3>
                <p className="text-sm text-muted-foreground">
                  Your APS score of {totalAPS} opens doors to various South African universities. Universities typically require between 18-42 APS points depending on the program.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-6"
        >
          <h2 className="text-xl mb-4">Subject Breakdown</h2>
          <div className="space-y-3">
            {apsData.map((subject, index) => (
              <motion.div
                key={subject.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <Card>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="truncate mb-1">{subject.name}</h3>
                      <p className="text-sm text-muted-foreground">Mark: {subject.mark}%</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl text-secondary mb-1">{subject.points}</div>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(subject.points / 7) * 100}%` }}
                        transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-secondary to-secondary/80 rounded-full"
                      />
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
          transition={{ delay: 1.5 }}
          className="space-y-3"
        >
          <Button
            onClick={handleViewMatches}
            variant="primary"
            size="lg"
            fullWidth
          >
            <School size={20} />
            View University Matches
          </Button>

          <Button
            onClick={() => navigate("/calculate")}
            variant="outline"
            fullWidth
          >
            Recalculate APS
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
