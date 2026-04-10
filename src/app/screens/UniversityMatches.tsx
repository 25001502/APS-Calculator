import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, School, MapPin, Filter, Bookmark, BookmarkCheck } from "lucide-react";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { BottomNav } from "../components/BottomNav";

const universities = [
  {
    id: 1,
    name: "University of Cape Town",
    location: "Cape Town, Western Cape",
    minAPS: 35,
    maxAPS: 42,
    programs: ["Medicine", "Engineering", "Commerce", "Law"],
    province: "Western Cape",
  },
  {
    id: 2,
    name: "University of Pretoria",
    location: "Pretoria, Gauteng",
    minAPS: 28,
    maxAPS: 38,
    programs: ["Engineering", "Veterinary Science", "Education", "Health Sciences"],
    province: "Gauteng",
  },
  {
    id: 3,
    name: "Stellenbosch University",
    location: "Stellenbosch, Western Cape",
    minAPS: 32,
    maxAPS: 40,
    programs: ["Business", "Sciences", "Arts", "Theology"],
    province: "Western Cape",
  },
  {
    id: 4,
    name: "University of Witwatersrand",
    location: "Johannesburg, Gauteng",
    minAPS: 30,
    maxAPS: 40,
    programs: ["Engineering", "Health Sciences", "Humanities", "Commerce"],
    province: "Gauteng",
  },
  {
    id: 5,
    name: "Rhodes University",
    location: "Makhanda, Eastern Cape",
    minAPS: 26,
    maxAPS: 35,
    programs: ["Pharmacy", "Journalism", "Sciences", "Law"],
    province: "Eastern Cape",
  },
  {
    id: 6,
    name: "University of Johannesburg",
    location: "Johannesburg, Gauteng",
    minAPS: 24,
    maxAPS: 36,
    programs: ["Engineering", "Art & Design", "Education", "Law"],
    province: "Gauteng",
  },
  {
    id: 7,
    name: "University of KwaZulu-Natal",
    location: "Durban, KwaZulu-Natal",
    minAPS: 26,
    maxAPS: 38,
    programs: ["Medicine", "Engineering", "Agriculture", "Social Sciences"],
    province: "KwaZulu-Natal",
  },
  {
    id: 8,
    name: "North-West University",
    location: "Potchefstroom, North West",
    minAPS: 22,
    maxAPS: 32,
    programs: ["Education", "Commerce", "Natural Sciences", "Law"],
    province: "North West",
  },
];

export function UniversityMatches() {
  const navigate = useNavigate();
  const [userAPS, setUserAPS] = useState<number>(0);
  const [savedUniversities, setSavedUniversities] = useState<number[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("All");

  useEffect(() => {
    const stored = localStorage.getItem("userAPS");
    if (stored) {
      setUserAPS(parseInt(stored));
    }

    const saved = localStorage.getItem("savedUniversities");
    if (saved) {
      setSavedUniversities(JSON.parse(saved));
    }
  }, []);

  const getMatchStatus = (minAPS: number, maxAPS: number) => {
    if (!userAPS) return { label: "Check Requirements", variant: "default" as const, score: 0 };
    if (userAPS >= maxAPS) return { label: "Strong Match", variant: "success" as const, score: 3 };
    if (userAPS >= minAPS) return { label: "Possible Match", variant: "info" as const, score: 2 };
    if (userAPS >= minAPS - 3) return { label: "Stretch Option", variant: "warning" as const, score: 1 };
    return { label: "Below Requirement", variant: "default" as const, score: 0 };
  };

  const toggleSave = (id: number) => {
    const updated = savedUniversities.includes(id)
      ? savedUniversities.filter((uId) => uId !== id)
      : [...savedUniversities, id];

    setSavedUniversities(updated);
    localStorage.setItem("savedUniversities", JSON.stringify(updated));
  };

  const provinces = ["All", ...Array.from(new Set(universities.map((u) => u.province)))];

  const filteredUniversities = universities
    .filter((u) => selectedProvince === "All" || u.province === selectedProvince)
    .map((u) => ({ ...u, match: getMatchStatus(u.minAPS, u.maxAPS) }))
    .sort((a, b) => b.match.score - a.match.score);

  return (
    <div className="min-h-screen pb-24">
      <div className="bg-gradient-to-br from-primary to-secondary/80 text-white px-6 pt-12 pb-8 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate("/home")} className="hover:opacity-70">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl">University Matches</h1>
            {userAPS > 0 && (
              <p className="text-white/80 text-sm mt-1">Your APS: {userAPS}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {provinces.map((province) => (
            <button
              key={province}
              onClick={() => setSelectedProvince(province)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                selectedProvince === province
                  ? "bg-white text-primary"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {province}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 mt-6">
        {userAPS === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="mb-6 bg-accent/10 border-accent/20 text-center">
              <Filter size={32} className="text-accent mx-auto mb-3" />
              <h3 className="mb-2">Calculate your APS first</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get personalized university matches by calculating your Admission Point Score
              </p>
              <Button onClick={() => navigate("/calculate")} variant="primary">
                Calculate APS
              </Button>
            </Card>
          </motion.div>
        )}

        <div className="space-y-4">
          {filteredUniversities.map((uni, index) => {
            const isSaved = savedUniversities.includes(uni.id);

            return (
              <motion.div
                key={uni.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
                            toggleSave(uni.id);
                          }}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                          {isSaved ? (
                            <BookmarkCheck size={20} className="text-accent fill-accent" />
                          ) : (
                            <Bookmark size={20} className="text-muted-foreground" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <MapPin size={14} />
                        <span>{uni.location}</span>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground">
                          APS Range: {uni.minAPS}-{uni.maxAPS}
                        </span>
                        <Badge variant={uni.match.variant}>
                          {uni.match.label}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {uni.programs.slice(0, 3).map((program) => (
                          <span
                            key={program}
                            className="text-xs px-2 py-1 bg-muted rounded-lg text-muted-foreground"
                          >
                            {program}
                          </span>
                        ))}
                        {uni.programs.length > 3 && (
                          <span className="text-xs px-2 py-1 text-muted-foreground">
                            +{uni.programs.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredUniversities.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <School size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No universities found for this province</p>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
