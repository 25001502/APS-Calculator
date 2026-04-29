import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, BookOpenCheck, CheckCircle2, Filter, Search, XCircle } from "lucide-react";
import { Badge } from "../components/Badge";
import { BottomNav } from "../components/BottomNav";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Select } from "../components/Select";
import { calculateTotalAPS, type APSSubject } from "../utils/aps";
import { checkRequirements, getProgramOpportunities } from "../utils/programMatching";
import { parseStoredJSON } from "../utils/storage";

const opportunities = getProgramOpportunities();
const fields = ["All", ...Array.from(new Set(opportunities.map((opportunity) => opportunity.field))).sort()];

export function ProgramMatches() {
  const navigate = useNavigate();
  const [apsData, setApsData] = useState<APSSubject[]>([]);
  const [selectedField, setSelectedField] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setApsData(parseStoredJSON<APSSubject[]>(localStorage.getItem("apsData"), []));
  }, []);

  const userAPS = calculateTotalAPS(apsData);
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredOpportunities = opportunities
    .filter((opportunity) => selectedField === "All" || opportunity.field === selectedField)
    .filter((opportunity) => {
      if (!normalizedSearch) return true;
      return `${opportunity.program} ${opportunity.university.name} ${opportunity.facultyName}`
        .toLowerCase()
        .includes(normalizedSearch);
    })
    .map((opportunity) => {
      const requirements = checkRequirements(opportunity.requirements, apsData);
      const missingCount = requirements.filter((requirement) => !requirement.met).length;
      const apsGap = Math.max(opportunity.minAPS - userAPS, 0);
      const score = (apsGap === 0 ? 2 : apsGap <= 3 ? 1 : 0) + (missingCount === 0 ? 1 : 0);

      return { ...opportunity, apsGap, missingCount, requirementResults: requirements, score };
    })
    .sort((a, b) => b.score - a.score || a.apsGap - b.apsGap || a.minAPS - b.minAPS)
    .slice(0, 40);

  return (
    <div className="min-h-screen pb-24 md:pt-20 md:pb-10">
      <div className="bg-gradient-to-br from-primary to-secondary/80 text-white px-6 pt-12 pb-8 sticky top-0 z-10 md:top-16 md:px-16">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate("/home")} className="hover:opacity-70" aria-label="Go to home">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl">Program Matches</h1>
            <p className="text-white/80 text-sm mt-1">
              {userAPS > 0 ? `Your APS: ${userAPS}` : "Calculate APS to personalize matches"}
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search programs or universities"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <Select
            aria-label="Filter by field"
            value={selectedField}
            onChange={(event) => setSelectedField(event.target.value)}
            options={fields.map((field) => ({ value: field, label: field }))}
            className="bg-white text-foreground"
          />
        </div>
      </div>

      <div className="px-6 mt-6 md:max-w-5xl md:mx-auto">
        {apsData.length === 0 && (
          <Card className="mb-6 bg-accent/10 border-accent/20 text-center">
            <Filter size={32} className="text-accent mx-auto mb-3" />
            <h3 className="mb-2">No APS subjects yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Program matches become sharper once your marks are saved.
            </p>
            <Button onClick={() => navigate("/calculate")} variant="success">
              Calculate APS
            </Button>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {filteredOpportunities.map((opportunity, index) => {
            const apsReady = userAPS >= opportunity.minAPS;
            const requirementsReady = opportunity.missingCount === 0;
            const badgeVariant = apsReady && requirementsReady ? "success" : opportunity.apsGap <= 3 ? "warning" : "default";
            const badgeLabel = apsReady && requirementsReady
              ? "Ready"
              : apsReady
                ? "Check subjects"
                : opportunity.apsGap <= 3
                  ? `Need ${opportunity.apsGap} APS`
                  : "Reach";

            return (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
              >
                <Card hover onClick={() => navigate(`/university/${opportunity.university.id}`)}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                      <BookOpenCheck size={24} className="text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0">
                          <h3 className="truncate">{opportunity.program}</h3>
                          <p className="text-sm text-muted-foreground truncate">{opportunity.university.name}</p>
                        </div>
                        <Badge variant={badgeVariant}>{badgeLabel}</Badge>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-xs px-2 py-1 rounded-lg bg-muted text-muted-foreground">
                          APS {opportunity.minAPS}+
                        </span>
                        <span className="text-xs px-2 py-1 rounded-lg bg-muted text-muted-foreground">
                          {opportunity.field}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {opportunity.requirementResults.length === 0 ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 size={16} className="text-success" />
                            No extra subject rule captured
                          </div>
                        ) : (
                          opportunity.requirementResults.map((requirement) => (
                            <div key={requirement.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                              {requirement.met ? (
                                <CheckCircle2 size={16} className="text-success" />
                              ) : (
                                <XCircle size={16} className="text-warning" />
                              )}
                              <span>
                                {requirement.label} {requirement.minMark}%+
                                {requirement.actualMark !== undefined ? ` (${requirement.actualMark}%)` : ""}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredOpportunities.length === 0 && (
          <div className="py-12 text-center">
            <BookOpenCheck size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No programs found for this search.</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
