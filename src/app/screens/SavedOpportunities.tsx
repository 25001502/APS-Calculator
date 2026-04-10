import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { School, MapPin, Trash2, BookmarkX } from "lucide-react";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { BottomNav } from "../components/BottomNav";
import { parseStoredInt, parseStoredJSON } from "../utils/storage";

const universities = [
  { id: 1, name: "University of Cape Town", location: "Western Cape", minAPS: 35, maxAPS: 42, note: "Best fit" },
  { id: 2, name: "University of Pretoria", location: "Gauteng", minAPS: 28, maxAPS: 38, note: "Strong programs" },
  { id: 3, name: "Stellenbosch University", location: "Western Cape", minAPS: 32, maxAPS: 40, note: "Reach option" },
  { id: 4, name: "University of Witwatersrand", location: "Gauteng", minAPS: 30, maxAPS: 40, note: "Good match" },
  { id: 5, name: "Rhodes University", location: "Eastern Cape", minAPS: 26, maxAPS: 35, note: "Backup option" },
  { id: 6, name: "University of Johannesburg", location: "Gauteng", minAPS: 24, maxAPS: 36, note: "Safety school" },
];

export function SavedOpportunities() {
  const navigate = useNavigate();
  const [savedUniversities, setSavedUniversities] = useState<number[]>([]);
  const [userAPS, setUserAPS] = useState<number>(0);

  useEffect(() => {
    setSavedUniversities(parseStoredJSON<number[]>(localStorage.getItem("savedUniversities"), []));
    setUserAPS(parseStoredInt(localStorage.getItem("userAPS"), 0));
  }, []);

  const removeSaved = (id: number) => {
    const updated = savedUniversities.filter((uId) => uId !== id);
    setSavedUniversities(updated);
    localStorage.setItem("savedUniversities", JSON.stringify(updated));
  };

  const savedList = universities.filter((u) => savedUniversities.includes(u.id));

  const getNoteVariant = (note: string) => {
    if (note.includes("Best") || note.includes("Good")) return "success";
    if (note.includes("Reach")) return "warning";
    return "info";
  };

  return (
    <div className="min-h-screen pb-24 md:pt-20 md:pb-10">
      <div className="bg-gradient-to-br from-primary to-secondary/80 text-white px-6 pt-12 pb-8">
        <h1 className="text-3xl mb-2">Saved Opportunities</h1>
        <p className="text-white/80">
          {savedList.length} {savedList.length === 1 ? "university" : "universities"} saved
        </p>
      </div>

      <div className="px-6 mt-6">
        {savedList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <BookmarkX size={40} className="text-muted-foreground" />
            </div>
            <h2 className="text-xl mb-2">No saved universities yet</h2>
            <p className="text-muted-foreground mb-6">
              Start saving universities you're interested in to keep track of your options
            </p>
            <button
              onClick={() => navigate("/matches")}
              className="text-primary hover:underline"
            >
              Browse Universities
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {savedList.map((uni, index) => {
              const matchesAPS = userAPS >= uni.minAPS && userAPS <= uni.maxAPS;

              return (
                <motion.div
                  key={uni.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card hover onClick={() => navigate(`/university/${uni.id}`)}>
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center flex-shrink-0">
                        <School size={28} className="text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-lg">{uni.name}</h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSaved(uni.id);
                            }}
                            className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                            aria-label={`Remove ${uni.name} from saved universities`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <MapPin size={14} />
                          <span>{uni.location}</span>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-muted-foreground">
                            APS: {uni.minAPS}-{uni.maxAPS}
                          </span>
                          {userAPS > 0 && (
                            <Badge variant={matchesAPS ? "success" : "info"}>
                              {matchesAPS ? "Match" : "Check Requirements"}
                            </Badge>
                          )}
                        </div>

                        <Badge variant={getNoteVariant(uni.note)} className="text-xs">
                          {uni.note}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}

            <Card className="bg-accent/10 border-accent/20 text-center mt-8">
              <h3 className="mb-2 text-accent">Application Strategy</h3>
              <p className="text-sm text-muted-foreground">
                Apply to a mix of "best fit", "good match", and "backup" universities to maximize your chances of admission.
              </p>
            </Card>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
