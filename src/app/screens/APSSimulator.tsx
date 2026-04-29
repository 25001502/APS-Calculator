import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Calculator, School, SlidersHorizontal, TrendingUp } from "lucide-react";
import { Badge } from "../components/Badge";
import { BottomNav } from "../components/BottomNav";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { universities } from "../data/universities";
import { calculateTotalAPS, getAPSPoints, type APSSubject } from "../utils/aps";
import { parseStoredJSON } from "../utils/storage";

export function APSSimulator() {
  const navigate = useNavigate();
  const [apsData, setApsData] = useState<APSSubject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [targetMark, setTargetMark] = useState("0");

  useEffect(() => {
    const storedSubjects = parseStoredJSON<APSSubject[]>(localStorage.getItem("apsData"), []);
    setApsData(storedSubjects);

    if (storedSubjects.length > 0) {
      setSelectedSubject(storedSubjects[0].name);
      setTargetMark(storedSubjects[0].mark.toString());
    }
  }, []);

  const currentAPS = calculateTotalAPS(apsData);
  const selected = apsData.find((subject) => subject.name === selectedSubject);
  const numericTarget = clampMark(Number(targetMark));

  const simulatedSubjects = apsData.map((subject) =>
    subject.name === selectedSubject
      ? { ...subject, mark: numericTarget, points: getAPSPoints(numericTarget) }
      : subject
  );

  const projectedAPS = calculateTotalAPS(simulatedSubjects);
  const apsChange = projectedAPS - currentAPS;
  const currentUniversityMatches = universities.filter((university) => currentAPS >= university.minAPS).length;
  const projectedUniversityMatches = universities.filter((university) => projectedAPS >= university.minAPS).length;
  const unlockedCount = Math.max(projectedUniversityMatches - currentUniversityMatches, 0);
  const selectedCurrentPoints = selected ? getAPSPoints(selected.mark) : 0;
  const selectedProjectedPoints = selected ? getAPSPoints(numericTarget) : 0;

  return (
    <div className="min-h-screen pb-24 md:pt-20 md:pb-10">
      <div className="bg-gradient-to-br from-primary to-secondary/80 text-white px-6 pt-12 pb-8 md:px-16">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate("/home")} className="hover:opacity-70" aria-label="Go to home">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl">APS Simulator</h1>
            <p className="text-white/80 text-sm mt-1">Test mark improvements before recalculating</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <p className="text-sm text-white/80 mb-1">Current APS</p>
            <p className="text-4xl">{currentAPS}</p>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <p className="text-sm text-white/80 mb-1">Projected APS</p>
            <div className="flex items-end gap-2">
              <p className="text-4xl">{projectedAPS}</p>
              {apsChange !== 0 && (
                <Badge variant={apsChange > 0 ? "success" : "warning"} className="mb-1 bg-white text-primary border-white">
                  {apsChange > 0 ? `+${apsChange}` : apsChange}
                </Badge>
              )}
            </div>
          </Card>
        </div>
      </div>

      <div className="px-6 mt-6 md:max-w-4xl md:mx-auto">
        {apsData.length === 0 ? (
          <Card className="bg-accent/10 border-accent/20 text-center">
            <Calculator size={32} className="text-accent mx-auto mb-3" />
            <h3 className="mb-2">Calculate your APS first</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The simulator needs saved subject marks before it can project improvements.
            </p>
            <Button onClick={() => navigate("/calculate")} variant="success">
              Calculate APS
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-[1fr_340px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card>
                <div className="flex items-start gap-3 mb-5">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <SlidersHorizontal size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3>Improve a subject</h3>
                    <p className="text-sm text-muted-foreground">Choose one mark and preview the APS impact.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Select
                    label="Subject"
                    value={selectedSubject}
                    onChange={(event) => {
                      const nextSubject = apsData.find((subject) => subject.name === event.target.value);
                      setSelectedSubject(event.target.value);
                      setTargetMark((nextSubject?.mark ?? 0).toString());
                    }}
                    options={apsData.map((subject) => ({ value: subject.name, label: subject.name }))}
                  />

                  <Input
                    label="Target mark"
                    type="number"
                    min="0"
                    max="100"
                    value={targetMark}
                    onChange={(event) => setTargetMark(event.target.value)}
                  />

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={numericTarget}
                    onChange={(event) => setTargetMark(event.target.value)}
                    className="w-full accent-primary"
                    aria-label="Target mark slider"
                  />

                  {selected && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-muted p-3">
                        <p className="text-xs text-muted-foreground mb-1">Now</p>
                        <p className="text-lg">{selected.mark}% / {selectedCurrentPoints} pts</p>
                      </div>
                      <div className="rounded-xl bg-secondary/10 p-3">
                        <p className="text-xs text-muted-foreground mb-1">Projected</p>
                        <p className="text-lg text-secondary">{numericTarget}% / {selectedProjectedPoints} pts</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              <Card>
                <h3 className="mb-4">Subject impact</h3>
                <div className="space-y-3">
                  {simulatedSubjects.map((subject) => {
                    const original = apsData.find((item) => item.name === subject.name);
                    const changed = original && original.points !== subject.points;

                    return (
                      <div key={subject.name} className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm truncate">{subject.name}</p>
                          <p className="text-xs text-muted-foreground">{subject.mark}%</p>
                        </div>
                        <Badge variant={changed ? "success" : "default"}>
                          {subject.points} pts
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
                <TrendingUp size={28} className="text-secondary mb-3" />
                <h3 className="mb-2">Match impact</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This projection would qualify for {projectedUniversityMatches} universities.
                </p>
                <div className="rounded-xl bg-card p-3 border border-border">
                  <p className="text-sm text-muted-foreground">New university options</p>
                  <p className="text-3xl text-secondary">{unlockedCount}</p>
                </div>
              </Card>

              <Card>
                <School size={28} className="text-primary mb-3" />
                <h3 className="mb-2">Next step</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Recalculate with updated marks when you are ready to save the new APS.
                </p>
                <Button onClick={() => navigate("/calculate")} fullWidth>
                  Recalculate APS
                </Button>
              </Card>
            </motion.div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

function clampMark(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}
