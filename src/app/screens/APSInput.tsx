import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Plus, Trash2, Calculator } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";

const availableSubjects = [
  "English Home Language",
  "English First Additional Language",
  "Afrikaans Home Language",
  "Mathematics",
  "Mathematical Literacy",
  "Physical Sciences",
  "Life Sciences",
  "Geography",
  "History",
  "Accounting",
  "Business Studies",
  "Economics",
  "Information Technology",
  "Visual Arts",
  "Dramatic Arts",
  "Music",
];

interface Subject {
  id: string;
  name: string;
  mark: string;
}

export function APSInput() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: "1", name: "", mark: "" },
  ]);

  const addSubject = () => {
    if (subjects.length < 7) {
      setSubjects([...subjects, { id: Date.now().toString(), name: "", mark: "" }]);
    }
  };

  const removeSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((s) => s.id !== id));
    }
  };

  const updateSubject = (id: string, field: "name" | "mark", value: string) => {
    setSubjects(
      subjects.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const calculateAPS = () => {
    const filledSubjects = subjects.filter((s) => s.name && s.mark);
    if (filledSubjects.length >= 6) {
      const apsData = filledSubjects.map((s) => ({
        name: s.name,
        mark: parseInt(s.mark),
        points: getAPSPoints(parseInt(s.mark)),
      }));

      localStorage.setItem("apsData", JSON.stringify(apsData));
      navigate("/result");
    }
  };

  const getAPSPoints = (mark: number): number => {
    if (mark >= 80) return 7;
    if (mark >= 70) return 6;
    if (mark >= 60) return 5;
    if (mark >= 50) return 4;
    if (mark >= 40) return 3;
    if (mark >= 30) return 2;
    return 1;
  };

  const canCalculate = subjects.filter((s) => s.name && s.mark && parseInt(s.mark) >= 0 && parseInt(s.mark) <= 100).length >= 6;

  return (
    <div className="min-h-screen pb-8">
      <div className="bg-gradient-to-br from-primary to-secondary/80 text-white px-6 pt-12 pb-8">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate("/home")} className="hover:opacity-70">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl">Calculate APS</h1>
            <p className="text-white/80 text-sm mt-1">Enter your Grade 12 marks</p>
          </div>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <div className="flex items-center gap-3 text-white">
            <Calculator size={20} />
            <div className="flex-1">
              <p className="text-sm opacity-90">Subjects entered</p>
              <p className="text-2xl">{subjects.filter((s) => s.name && s.mark).length} / 6 minimum</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="px-6 mt-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 mb-6"
        >
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="block text-sm mb-2 text-foreground/80">
                        Subject {index + 1}
                      </label>
                      <select
                        value={subject.name}
                        onChange={(e) => updateSubject(subject.id, "name", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="">Select subject</option>
                        {availableSubjects.map((subj) => (
                          <option key={subj} value={subj}>
                            {subj}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Input
                      label="Mark (%)"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0-100"
                      value={subject.mark}
                      onChange={(e) => updateSubject(subject.id, "mark", e.target.value)}
                    />

                    {subject.mark && parseInt(subject.mark) >= 0 && parseInt(subject.mark) <= 100 && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">APS Points:</span>
                        <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full">
                          {getAPSPoints(parseInt(subject.mark))}
                        </span>
                      </div>
                    )}
                  </div>

                  {subjects.length > 1 && (
                    <button
                      onClick={() => removeSubject(subject.id)}
                      className="mt-8 p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {subjects.length < 7 && (
          <Button
            onClick={addSubject}
            variant="outline"
            fullWidth
            className="mb-6"
          >
            <Plus size={20} />
            Add Another Subject
          </Button>
        )}

        <Card className="bg-primary/5 border-primary/20 mb-6">
          <h3 className="mb-2 text-primary">How APS Points Work</h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>80-100%</span>
              <span className="text-foreground">7 points</span>
            </div>
            <div className="flex justify-between">
              <span>70-79%</span>
              <span className="text-foreground">6 points</span>
            </div>
            <div className="flex justify-between">
              <span>60-69%</span>
              <span className="text-foreground">5 points</span>
            </div>
            <div className="flex justify-between">
              <span>50-59%</span>
              <span className="text-foreground">4 points</span>
            </div>
            <div className="flex justify-between">
              <span>40-49%</span>
              <span className="text-foreground">3 points</span>
            </div>
            <div className="flex justify-between">
              <span>30-39%</span>
              <span className="text-foreground">2 points</span>
            </div>
            <div className="flex justify-between">
              <span>0-29%</span>
              <span className="text-foreground">1 point</span>
            </div>
          </div>
        </Card>

        <Button
          onClick={calculateAPS}
          variant="primary"
          size="lg"
          fullWidth
          disabled={!canCalculate}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Calculator size={20} />
          Calculate My APS
        </Button>
      </div>
    </div>
  );
}
