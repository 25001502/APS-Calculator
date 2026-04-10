import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, MapPin, GraduationCap, ExternalLink, Bookmark, BookmarkCheck, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";

const universityData: Record<string, any> = {
  "1": {
    name: "University of Cape Town",
    location: "Cape Town, Western Cape",
    minAPS: 35,
    maxAPS: 42,
    website: "https://www.uct.ac.za",
    overview: "UCT is Africa's leading university and one of the world's top research universities. Known for academic excellence and beautiful campus.",
    faculties: [
      { name: "Faculty of Health Sciences", minAPS: 40, programs: ["Medicine (MBChB)", "Physiotherapy", "Occupational Therapy"] },
      { name: "Faculty of Engineering", minAPS: 38, programs: ["Chemical Engineering", "Civil Engineering", "Electrical Engineering"] },
      { name: "Faculty of Commerce", minAPS: 36, programs: ["BCom Accounting", "BCom Finance", "Economics"] },
      { name: "Faculty of Law", minAPS: 35, programs: ["LLB", "BA Law"] },
    ],
    admissionNotes: "Competitive selection process. Some programs require additional assessments. International recognition.",
  },
  "2": {
    name: "University of Pretoria",
    location: "Pretoria, Gauteng",
    minAPS: 28,
    maxAPS: 38,
    website: "https://www.up.ac.za",
    overview: "UP is one of South Africa's largest and most prestigious universities, known for research excellence and diverse programs.",
    faculties: [
      { name: "Faculty of Engineering", minAPS: 35, programs: ["BSc Engineering (various)", "BEng (various)", "Industrial Engineering"] },
      { name: "Faculty of Veterinary Science", minAPS: 38, programs: ["BVSc (Veterinary Science)"] },
      { name: "Faculty of Education", minAPS: 28, programs: ["BEd Foundation Phase", "BEd Senior Phase"] },
      { name: "Faculty of Health Sciences", minAPS: 36, programs: ["Medicine", "Dentistry", "Nursing"] },
    ],
    admissionNotes: "Well-established programs. Strong industry connections. Various campuses across Pretoria.",
  },
  "3": {
    name: "Stellenbosch University",
    location: "Stellenbosch, Western Cape",
    minAPS: 32,
    maxAPS: 40,
    website: "https://www.sun.ac.za",
    overview: "Stellenbosch is renowned for academic excellence, beautiful campus, and vibrant student life in the Western Cape winelands.",
    faculties: [
      { name: "Faculty of Economic and Management Sciences", minAPS: 35, programs: ["BCom (various)", "Business Management"] },
      { name: "Faculty of Science", minAPS: 32, programs: ["BSc (various)", "Computer Science", "Data Science"] },
      { name: "Faculty of Arts and Social Sciences", minAPS: 32, programs: ["BA (various)", "Psychology", "Sociology"] },
      { name: "Faculty of Theology", minAPS: 30, programs: ["BTh", "BDiv"] },
    ],
    admissionNotes: "Bilingual university (Afrikaans and English). Beautiful historic campus. Strong research output.",
  },
  "4": {
    name: "University of Witwatersrand",
    location: "Johannesburg, Gauteng",
    minAPS: 30,
    maxAPS: 40,
    website: "https://www.wits.ac.za",
    overview: "Wits is a world-class research university known for academic excellence, particularly in mining, health sciences, and commerce.",
    faculties: [
      { name: "Faculty of Engineering", minAPS: 36, programs: ["Mining Engineering", "Chemical Engineering", "Electrical Engineering"] },
      { name: "Faculty of Health Sciences", minAPS: 38, programs: ["Medicine", "Pharmacy", "Physiotherapy"] },
      { name: "Faculty of Humanities", minAPS: 30, programs: ["BA (various)", "Social Work", "Psychology"] },
      { name: "Faculty of Commerce, Law and Management", minAPS: 34, programs: ["BCom (various)", "LLB", "Actuarial Science"] },
    ],
    admissionNotes: "Located in the heart of Johannesburg. Strong alumni network. Excellent research facilities.",
  },
};

export function UniversityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userAPS, setUserAPS] = useState<number>(0);
  const [savedUniversities, setSavedUniversities] = useState<number[]>([]);

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

  const university = universityData[id || "1"] || universityData["1"];
  const isSaved = savedUniversities.includes(parseInt(id || "1"));

  const toggleSave = () => {
    const uniId = parseInt(id || "1");
    const updated = isSaved
      ? savedUniversities.filter((uId) => uId !== uniId)
      : [...savedUniversities, uniId];

    setSavedUniversities(updated);
    localStorage.setItem("savedUniversities", JSON.stringify(updated));
  };

  const qualifies = userAPS >= university.minAPS;

  return (
    <div className="min-h-screen pb-8">
      <div className="bg-gradient-to-br from-primary to-secondary/80 text-white px-6 pt-12 pb-8">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="hover:opacity-70">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl">{university.name}</h1>
          </div>
          <button
            onClick={toggleSave}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
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

      <div className="px-6 mt-6">
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
          <div className="space-y-4">
            {university.faculties.map((faculty: any, index: number) => {
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
                      {faculty.programs.map((program: string) => (
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
            variant="primary"
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
