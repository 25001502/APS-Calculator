import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, MapPin, GraduationCap, ExternalLink, Bookmark, BookmarkCheck, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { universityData } from "../data/universities";
import { parseStoredInt, parseStoredJSON } from "../utils/storage";

export function UniversityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userAPS, setUserAPS] = useState<number>(0);
  const [savedUniversities, setSavedUniversities] = useState<number[]>([]);
  const universityId = Number.parseInt(id ?? "", 10);
  const university = Number.isNaN(universityId) ? undefined : universityData[universityId.toString()];

  useEffect(() => {
    setUserAPS(parseStoredInt(localStorage.getItem("userAPS"), 0));
    setSavedUniversities(parseStoredJSON<number[]>(localStorage.getItem("savedUniversities"), []));
  }, []);

  useEffect(() => {
    if (!university) {
      navigate("/matches", { replace: true });
    }
  }, [navigate, university]);

  if (!university || Number.isNaN(universityId)) {
    return null;
  }

  const isSaved = savedUniversities.includes(universityId);

  const toggleSave = () => {
    const updated = isSaved
      ? savedUniversities.filter((uId) => uId !== universityId)
      : [...savedUniversities, universityId];

    setSavedUniversities(updated);
    localStorage.setItem("savedUniversities", JSON.stringify(updated));
  };

  const qualifies = userAPS >= university.minAPS;

  return (
    <div className="min-h-screen pb-8 md:pt-10">
      <div className="bg-gradient-to-br from-primary to-secondary/80 text-white px-6 pt-12 pb-8 md:px-16">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="hover:opacity-70" aria-label="Go back">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl">{university.name}</h1>
          </div>
          <button
            onClick={toggleSave}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            aria-label={isSaved ? "Remove university from saved" : "Save university"}
          >
            {isSaved ? (
              <BookmarkCheck size={24} className="fill-white" />
            ) : (
              <Bookmark size={24} />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <MapPin size={18} />
          <span className="text-white/90">{university.location}</span>
        </div>

        {userAPS > 0 && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <div className="flex items-center gap-3 text-white">
              {qualifies ? (
                <CheckCircle2 size={24} className="text-secondary" />
              ) : (
                <XCircle size={24} className="text-destructive" />
              )}
              <div>
                <p className="text-sm opacity-90">Your APS: {userAPS}</p>
                <p className="text-lg">
                  {qualifies
                    ? "You may qualify for this university!"
                    : `Need ${university.minAPS - userAPS} more points`}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="px-6 mt-6 md:max-w-3xl md:mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card>
            <h2 className="text-xl mb-3">Overview</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {university.overview}
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">APS Range</span>
              <span className="text-lg">
                {university.minAPS} - {university.maxAPS}
              </span>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="text-xl mb-4">Faculties & Programs</h2>
          <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
            {university.faculties.map((faculty, index) => {
              const canQualify = userAPS >= faculty.minAPS;

              return (
                <motion.div
                  key={faculty.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Card>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                        <GraduationCap size={20} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="mb-1">{faculty.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Min APS: {faculty.minAPS}
                          </span>
                          {userAPS > 0 && (
                            <Badge variant={canQualify ? "success" : "warning"}>
                              {canQualify ? "Eligible" : "Not Eligible"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {faculty.programs.map((program) => (
                        <div
                          key={program}
                          className="text-sm text-muted-foreground flex items-center gap-2"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          {program}
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <Card className="bg-primary/5 border-primary/20">
            <h3 className="mb-2 text-primary">Admission Notes</h3>
            <p className="text-sm text-muted-foreground">
              {university.admissionNotes}
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <Button
            onClick={() => window.open(university.website, "_blank")}
            variant="success"
            size="lg"
            fullWidth
          >
            <ExternalLink size={20} />
            Visit University Website
          </Button>

          <Button
            onClick={() => navigate("/compare")}
            variant="outline"
            fullWidth
          >
            Compare with Other Universities
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
