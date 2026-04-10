import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, School, MapPin, X } from "lucide-react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { BottomNav } from "../components/BottomNav";

const universities = [
  { id: 1, name: "University of Cape Town", location: "Western Cape", minAPS: 35, maxAPS: 42, programs: 4 },
  { id: 2, name: "University of Pretoria", location: "Gauteng", minAPS: 28, maxAPS: 38, programs: 4 },
  { id: 3, name: "Stellenbosch University", location: "Western Cape", minAPS: 32, maxAPS: 40, programs: 4 },
  { id: 4, name: "University of Witwatersrand", location: "Gauteng", minAPS: 30, maxAPS: 40, programs: 4 },
  { id: 5, name: "Rhodes University", location: "Eastern Cape", minAPS: 26, maxAPS: 35, programs: 4 },
  { id: 6, name: "University of Johannesburg", location: "Gauteng", minAPS: 24, maxAPS: 36, programs: 4 },
];

export function CompareUniversities() {
  const navigate = useNavigate();
  const [selectedUniversities, setSelectedUniversities] = useState<typeof universities>([
    universities[0],
    universities[1],
  ]);
  const [showSelector, setShowSelector] = useState(false);
  const [selectingIndex, setSelectingIndex] = useState<number>(0);

  const handleSelectUniversity = (uni: typeof universities[0]) => {
    const updated = [...selectedUniversities];
    updated[selectingIndex] = uni;
    setSelectedUniversities(updated);
    setShowSelector(false);
  };

  return (
    <div className="min-h-screen pb-24 md:pt-20 md:pb-10">
      <div className="bg-gradient-to-br from-primary to-secondary/80 text-white px-6 pt-12 pb-8 sticky top-0 z-10 md:top-16">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/home")} className="hover:opacity-70" aria-label="Go to home">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl">Compare Universities</h1>
        </div>
      </div>

      <div className="px-6 mt-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {selectedUniversities.map((uni, index) => (
            <Button
              key={index}
              onClick={() => {
                setSelectingIndex(index);
                setShowSelector(true);
              }}
              variant="outline"
              className="text-left justify-start h-auto py-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">University {index + 1}</p>
                <p className="truncate text-sm">{uni.name}</p>
              </div>
            </Button>
          ))}
        </div>

        {showSelector ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3>Select University</h3>
                <button
                  onClick={() => setShowSelector(false)}
                  className="p-2 hover:bg-muted rounded-lg"
                  aria-label="Close university selector"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {universities.map((uni) => (
                  <button
                    key={uni.id}
                    onClick={() => handleSelectUniversity(uni)}
                    className="w-full text-left p-3 rounded-xl hover:bg-muted transition-colors"
                  >
                    <p className="mb-1">{uni.name}</p>
                    <p className="text-sm text-muted-foreground">{uni.location}</p>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <Card>
              <h3 className="mb-4">Basic Information</h3>
              <div className="space-y-4">
                <ComparisonRow
                  label="Location"
                  values={selectedUniversities.map((u) => u.location)}
                />
                <ComparisonRow
                  label="Minimum APS"
                  values={selectedUniversities.map((u) => u.minAPS.toString())}
                  highlight
                />
                <ComparisonRow
                  label="Maximum APS"
                  values={selectedUniversities.map((u) => u.maxAPS.toString())}
                  highlight
                />
                <ComparisonRow
                  label="Available Faculties"
                  values={selectedUniversities.map((u) => `${u.programs} faculties`)}
                />
              </div>
            </Card>

            <Card>
              <h3 className="mb-4">Key Features</h3>
              <div className="grid grid-cols-2 gap-4">
                {selectedUniversities.map((uni, index) => (
                  <div key={index} className="space-y-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-2">
                      <School size={24} className="text-white" />
                    </div>
                    <p className="text-sm">
                      {uni.id === 1 && "Research excellence, International recognition"}
                      {uni.id === 2 && "Diverse programs, Strong industry ties"}
                      {uni.id === 3 && "Academic excellence, Beautiful campus"}
                      {uni.id === 4 && "Research focused, Urban location"}
                      {uni.id === 5 && "Pharmacy excellence, Intimate campus"}
                      {uni.id === 6 && "Art & Design, Accessible programs"}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-secondary/10 border-secondary/20">
              <h3 className="mb-2 text-secondary">Comparison Tip</h3>
              <p className="text-sm text-muted-foreground">
                Consider factors beyond APS: location, program offerings, campus culture, and career opportunities.
              </p>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              {selectedUniversities.map((uni, index) => (
                <Button
                  key={index}
                  onClick={() => navigate(`/university/${uni.id}`)}
                  variant="primary"
                >
                  View Details
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

function ComparisonRow({
  label,
  values,
  highlight = false,
}: {
  label: string;
  values: string[];
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      <div className="grid grid-cols-2 gap-4">
        {values.map((value, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg ${
              highlight ? "bg-secondary/10 text-secondary" : "bg-muted"
            }`}
          >
            <p className={highlight ? "text-lg" : ""}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
