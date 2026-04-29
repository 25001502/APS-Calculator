import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, CalendarDays, CheckCircle2, ClipboardList, Plus, Trash2 } from "lucide-react";
import { Badge } from "../components/Badge";
import { BottomNav } from "../components/BottomNav";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { universities } from "../data/universities";
import { parseStoredJSON } from "../utils/storage";

type ApplicationStatus = "Interested" | "Preparing" | "Submitted" | "Offer" | "Not accepted";

interface ApplicationEntry {
  id: string;
  universityId: number;
  status: ApplicationStatus;
  deadline: string;
  note: string;
}

const storageKey = "applicationTracker";
const statuses: ApplicationStatus[] = ["Interested", "Preparing", "Submitted", "Offer", "Not accepted"];

const statusVariant: Record<ApplicationStatus, "default" | "info" | "warning" | "success"> = {
  Interested: "info",
  Preparing: "warning",
  Submitted: "info",
  Offer: "success",
  "Not accepted": "default",
};

export function ApplicationTracker() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<ApplicationEntry[]>([]);
  const [universityId, setUniversityId] = useState(universities[0].id.toString());
  const [status, setStatus] = useState<ApplicationStatus>("Interested");
  const [deadline, setDeadline] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    setEntries(parseStoredJSON<ApplicationEntry[]>(localStorage.getItem(storageKey), []));
  }, []);

  const persistEntries = (nextEntries: ApplicationEntry[]) => {
    setEntries(nextEntries);
    localStorage.setItem(storageKey, JSON.stringify(nextEntries));
  };

  const addEntry = () => {
    const parsedUniversityId = Number.parseInt(universityId, 10);
    const existingEntry = entries.find((entry) => entry.universityId === parsedUniversityId);

    if (existingEntry) {
      const updated = entries.map((entry) =>
        entry.id === existingEntry.id ? { ...entry, status, deadline, note } : entry
      );
      persistEntries(updated);
      return;
    }

    persistEntries([
      ...entries,
      {
        id: Date.now().toString(),
        universityId: parsedUniversityId,
        status,
        deadline,
        note,
      },
    ]);
  };

  const updateStatus = (id: string, nextStatus: ApplicationStatus) => {
    persistEntries(entries.map((entry) => entry.id === id ? { ...entry, status: nextStatus } : entry));
  };

  const removeEntry = (id: string) => {
    persistEntries(entries.filter((entry) => entry.id !== id));
  };

  const trackedEntries = entries
    .map((entry) => ({ ...entry, university: universities.find((university) => university.id === entry.universityId) }))
    .filter((entry) => entry.university)
    .sort((a, b) => (a.deadline || "9999-12-31").localeCompare(b.deadline || "9999-12-31"));

  const submittedCount = entries.filter((entry) => entry.status === "Submitted" || entry.status === "Offer").length;

  return (
    <div className="min-h-screen pb-24 md:pt-20 md:pb-10">
      <div className="bg-gradient-to-br from-primary to-secondary/80 text-white px-6 pt-12 pb-8 md:px-16">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate("/home")} className="hover:opacity-70" aria-label="Go to home">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl">Application Tracker</h1>
            <p className="text-white/80 text-sm mt-1">Keep deadlines and progress in one place</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <p className="text-sm text-white/80 mb-1">Tracked</p>
            <p className="text-4xl">{entries.length}</p>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <p className="text-sm text-white/80 mb-1">Submitted or offers</p>
            <p className="text-4xl">{submittedCount}</p>
          </Card>
        </div>
      </div>

      <div className="px-6 mt-6 md:max-w-5xl md:mx-auto">
        <div className="grid gap-6 md:grid-cols-[360px_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Plus size={20} className="text-primary" />
                </div>
                <div>
                  <h3>Add university</h3>
                  <p className="text-sm text-muted-foreground">Track a saved option or any public university.</p>
                </div>
              </div>

              <div className="space-y-4">
                <Select
                  label="University"
                  value={universityId}
                  onChange={(event) => setUniversityId(event.target.value)}
                  options={universities.map((university) => ({
                    value: university.id.toString(),
                    label: university.name,
                  }))}
                />
                <Select
                  label="Status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value as ApplicationStatus)}
                  options={statuses.map((item) => ({ value: item, label: item }))}
                />
                <Input
                  label="Deadline"
                  type="date"
                  value={deadline}
                  onChange={(event) => setDeadline(event.target.value)}
                />
                <div>
                  <label className="block text-sm mb-2 text-foreground/80">Note</label>
                  <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    className="w-full min-h-24 px-4 py-3 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Documents, login details, or next action"
                  />
                </div>
                <Button onClick={addEntry} fullWidth>
                  <Plus size={18} />
                  Add to Tracker
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {trackedEntries.length === 0 ? (
              <Card className="text-center py-10">
                <ClipboardList size={40} className="mx-auto mb-3 text-muted-foreground" />
                <h3 className="mb-2">No applications tracked yet</h3>
                <p className="text-sm text-muted-foreground">
                  Add universities as you shortlist them, then update each status as you apply.
                </p>
              </Card>
            ) : (
              trackedEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <Card>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <h3>{entry.university?.name}</h3>
                        <p className="text-sm text-muted-foreground">{entry.university?.location}</p>
                      </div>
                      <button
                        onClick={() => removeEntry(entry.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        aria-label={`Remove ${entry.university?.name} from tracker`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="grid gap-3 md:grid-cols-[1fr_170px]">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={statusVariant[entry.status]}>{entry.status}</Badge>
                          {entry.deadline && (
                            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                              <CalendarDays size={14} />
                              {entry.deadline}
                            </span>
                          )}
                        </div>
                        {entry.note && (
                          <p className="text-sm text-muted-foreground">{entry.note}</p>
                        )}
                      </div>

                      <Select
                        aria-label={`Update ${entry.university?.name} status`}
                        value={entry.status}
                        onChange={(event) => updateStatus(entry.id, event.target.value as ApplicationStatus)}
                        options={statuses.map((item) => ({ value: item, label: item }))}
                      />
                    </div>
                  </Card>
                </motion.div>
              ))
            )}

            {trackedEntries.length > 0 && (
              <Card className="bg-success/10 border-success/20">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-success mt-1" />
                  <div>
                    <h3 className="text-success mb-1">Keep it moving</h3>
                    <p className="text-sm text-muted-foreground">
                      Update statuses after each submission so your shortlist stays useful during application season.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
