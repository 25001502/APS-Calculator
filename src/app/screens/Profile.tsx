import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { User, Award, School, Bookmark, Settings, ChevronRight, Calculator, TrendingUp } from "lucide-react";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { BottomNav } from "../components/BottomNav";
import { parseStoredInt, parseStoredJSON } from "../utils/storage";

interface APSSubject {
  name: string;
  mark: number;
  points: number;
}

export function Profile() {
  const navigate = useNavigate();
  const [userAPS, setUserAPS] = useState<number | null>(null);
  const [savedCount, setSavedCount] = useState(0);
  const [apsData, setApsData] = useState<APSSubject[]>([]);

  useEffect(() => {
    const aps = parseStoredInt(localStorage.getItem("userAPS"), -1);
    setUserAPS(aps >= 0 ? aps : null);
    setApsData(parseStoredJSON<APSSubject[]>(localStorage.getItem("apsData"), []));
    setSavedCount(parseStoredJSON<number[]>(localStorage.getItem("savedUniversities"), []).length);
  }, []);

  const getScoreLevel = (score: number | null) => {
    if (!score) return "Not calculated";
    if (score >= 36) return "Outstanding";
    if (score >= 30) return "Competitive";
    if (score >= 24) return "Good";
    return "Developing";
  };

  return (
    <div className="min-h-screen pb-24 md:pt-20 md:pb-10">
      <div className="bg-gradient-to-br from-primary to-secondary/80 text-white px-6 pt-12 pb-8 md:px-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <User size={40} />
          </div>
          <div>
            <h1 className="text-3xl">Profile</h1>
            <p className="text-white/80">Grade 12 Learner</p>
          </div>
        </div>

        {userAPS !== null && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">Current APS Score</p>
                <p className="text-4xl">{userAPS}</p>
              </div>
              <Badge variant="success" className="text-base">
                {getScoreLevel(userAPS)}
              </Badge>
            </div>
          </Card>
        )}
      </div>

      <div className="px-6 mt-6 md:max-w-4xl md:mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          <Card className="text-center">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Calculator size={24} className="text-secondary" />
            </div>
            <p className="text-2xl mb-1">{apsData.length}</p>
            <p className="text-sm text-muted-foreground">Subjects</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Bookmark size={24} className="text-accent" />
            </div>
            <p className="text-2xl mb-1">{savedCount}</p>
            <p className="text-sm text-muted-foreground">Saved</p>
          </Card>
        </motion.div>

        {userAPS !== null && apsData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-xl mb-4">Recent APS Calculation</h2>
            <Card>
              <div className="space-y-3">
                {apsData.slice(0, 3).map((subject, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm mb-1">{subject.name}</p>
                      <p className="text-xs text-muted-foreground">{subject.mark}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl text-secondary">{subject.points}</p>
                      <p className="text-xs text-muted-foreground">pts</p>
                    </div>
                  </div>
                ))}
                {apsData.length > 3 && (
                  <button
                    onClick={() => navigate("/result")}
                    className="text-primary text-sm hover:underline w-full text-center pt-2"
                  >
                    View all {apsData.length} subjects
                  </button>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Card hover onClick={() => navigate("/calculate")}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Calculator size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="mb-1">
                      {userAPS ? "Recalculate APS" : "Calculate APS"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {userAPS ? "Update your score" : "Get started"}
                    </p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-muted-foreground" />
              </div>
            </Card>

            <Card hover onClick={() => navigate("/matches")}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <School size={20} className="text-secondary" />
                  </div>
                  <div>
                    <p className="mb-1">University Matches</p>
                    <p className="text-sm text-muted-foreground">Find your fit</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-muted-foreground" />
              </div>
            </Card>

            <Card hover onClick={() => navigate("/saved")}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Bookmark size={20} className="text-accent" />
                  </div>
                  <div>
                    <p className="mb-1">Saved Universities</p>
                    <p className="text-sm text-muted-foreground">{savedCount} saved</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-muted-foreground" />
              </div>
            </Card>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl mb-4">Academic Tips</h2>
          <div className="space-y-3">
            <Card className="bg-secondary/5 border-secondary/20">
              <div className="flex items-start gap-3">
                <TrendingUp size={20} className="text-secondary mt-1" />
                <div>
                  <h3 className="mb-1 text-secondary">Boost Your APS</h3>
                  <p className="text-sm text-muted-foreground">
                    Focus on your top 6 subjects. Even a 10% improvement in one subject can add 1-2 APS points.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <div className="flex items-start gap-3">
                <Award size={20} className="text-primary mt-1" />
                <div>
                  <h3 className="mb-1 text-primary">Application Strategy</h3>
                  <p className="text-sm text-muted-foreground">
                    Apply to multiple universities across different APS ranges to maximize your opportunities.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
