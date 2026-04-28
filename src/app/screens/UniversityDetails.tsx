import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, MapPin, GraduationCap, ExternalLink, Bookmark, BookmarkCheck, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { parseStoredInt, parseStoredJSON } from "../utils/storage";

interface Faculty {
  name: string;
  minAPS: number;
  programs: string[];
}

interface UniversityDetail {
  name: string;
  location: string;
  minAPS: number;
  maxAPS: number;
  website: string;
  overview: string;
  faculties: Faculty[];
  admissionNotes: string;
}

const universityData: Record<string, UniversityDetail> = {
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
  "5": {
    name: "Rhodes University",
    location: "Makhanda, Eastern Cape",
    minAPS: 26,
    maxAPS: 35,
    website: "https://www.ru.ac.za",
    overview: "Rhodes University is known for strong humanities and science programs, smaller class sizes, and a close-knit campus community.",
    faculties: [
      { name: "Faculty of Humanities", minAPS: 26, programs: ["Journalism", "English", "Psychology"] },
      { name: "Faculty of Science", minAPS: 28, programs: ["Biotechnology", "Computer Science", "Mathematics"] },
      { name: "Faculty of Pharmacy", minAPS: 32, programs: ["Bachelor of Pharmacy (BPharm)"] },
    ],
    admissionNotes: "Small-campus experience with focused academic support. Program requirements can differ by department.",
  },
  "6": {
    name: "University of Johannesburg",
    location: "Johannesburg, Gauteng",
    minAPS: 24,
    maxAPS: 36,
    website: "https://www.uj.ac.za",
    overview: "UJ offers a broad set of career-oriented programs across multiple campuses with strong links to industry and innovation hubs.",
    faculties: [
      { name: "Faculty of Engineering and the Built Environment", minAPS: 30, programs: ["Civil Engineering", "Electrical Engineering", "Architecture"] },
      { name: "Faculty of Art, Design and Architecture", minAPS: 26, programs: ["Communication Design", "Fashion Design", "Fine Arts"] },
      { name: "Faculty of Education", minAPS: 24, programs: ["BEd Foundation Phase", "BEd Intermediate Phase"] },
    ],
    admissionNotes: "Urban multi-campus university with practical, employability-focused programs.",
  },
  "7": {
    name: "University of KwaZulu-Natal",
    location: "Durban, KwaZulu-Natal",
    minAPS: 26,
    maxAPS: 38,
    website: "https://www.ukzn.ac.za",
    overview: "UKZN is a research-intensive university with strengths in health sciences, agriculture, engineering, and social sciences.",
    faculties: [
      { name: "College of Health Sciences", minAPS: 35, programs: ["Medicine", "Nursing", "Physiotherapy"] },
      { name: "College of Agriculture, Engineering and Science", minAPS: 30, programs: ["Agricultural Science", "Chemical Engineering", "Environmental Science"] },
      { name: "College of Humanities", minAPS: 26, programs: ["Social Work", "Public Policy", "Psychology"] },
    ],
    admissionNotes: "Multiple campuses across KwaZulu-Natal. Admission scoring may vary by campus and program stream.",
  },
  "8": {
    name: "North-West University",
    location: "Potchefstroom, North West",
    minAPS: 22,
    maxAPS: 32,
    website: "https://www.nwu.ac.za",
    overview: "NWU provides broad undergraduate access with strong support systems, especially in education, commerce, law, and natural sciences.",
    faculties: [
      { name: "Faculty of Education", minAPS: 22, programs: ["BEd Senior Phase", "BEd FET Phase", "Educational Psychology"] },
      { name: "Faculty of Economic and Management Sciences", minAPS: 24, programs: ["BCom Accounting", "Economics", "Business Management"] },
      { name: "Faculty of Law", minAPS: 26, programs: ["BA Law", "LLB"] },
    ],
    admissionNotes: "Multiple campuses and pathways. Check faculty pages for minimum language and subject requirements.",
  },
  "9": {
    name: "University of the Free State",
    location: "Bloemfontein, Free State",
    minAPS: 20,
    maxAPS: 30,
    website: "https://www.ufs.ac.za",
    overview: "UFS is a comprehensive research university in Bloemfontein offering a wide range of programs with a strong focus on community engagement and transformation.",
    faculties: [
      { name: "Faculty of Health Sciences", minAPS: 28, programs: ["MBCHB (Medicine)", "Nursing Science", "Physiotherapy"] },
      { name: "Faculty of Law", minAPS: 24, programs: ["LLB", "BA Law", "BCom Law"] },
      { name: "Faculty of Humanities", minAPS: 20, programs: ["BA (various)", "Social Work", "Psychology"] },
      { name: "Faculty of Natural and Agricultural Sciences", minAPS: 22, programs: ["BSc (various)", "Agriculture", "Computer Science"] },
    ],
    admissionNotes: "Dual-medium institution (Afrikaans and English). Strong community-focused programs. Regional bursaries available.",
  },
  "10": {
    name: "University of the Western Cape",
    location: "Bellville, Western Cape",
    minAPS: 20,
    maxAPS: 28,
    website: "https://www.uwc.ac.za",
    overview: "UWC is a national asset and a university of choice, offering high-quality programs with a commitment to equity and social justice.",
    faculties: [
      { name: "Faculty of Dentistry", minAPS: 28, programs: ["BChD (Dentistry)", "Oral Hygiene"] },
      { name: "Faculty of Pharmacy", minAPS: 26, programs: ["BPharm", "Pharmaceutical Sciences"] },
      { name: "Faculty of Arts", minAPS: 20, programs: ["BA (various)", "Visual Arts", "Media Studies"] },
      { name: "School of Public Health", minAPS: 22, programs: ["Community Health", "Environmental Health", "Health Promotion"] },
    ],
    admissionNotes: "Strong reputation in health sciences. Historically disadvantaged communities focus. Located near Cape Town.",
  },
  "11": {
    name: "Nelson Mandela University",
    location: "Gqeberha, Eastern Cape",
    minAPS: 20,
    maxAPS: 30,
    website: "https://www.mandela.ac.za",
    overview: "NMU is a comprehensive university in the Eastern Cape with a strong emphasis on innovation, entrepreneurship, and community partnerships.",
    faculties: [
      { name: "Faculty of Engineering, the Built Environment & Technology", minAPS: 26, programs: ["Civil Engineering", "Electrical Engineering", "Architecture"] },
      { name: "Faculty of Business & Economic Sciences", minAPS: 22, programs: ["BCom (various)", "Business Administration", "Supply Chain"] },
      { name: "Faculty of Law", minAPS: 24, programs: ["LLB", "BA Law"] },
      { name: "Faculty of Education", minAPS: 20, programs: ["BEd Foundation Phase", "BEd Senior Phase"] },
    ],
    admissionNotes: "Formerly known as NMMU. Strong links to the Eastern Cape business sector. Multiple campuses in Gqeberha area.",
  },
  "12": {
    name: "University of Limpopo",
    location: "Sovenga, Limpopo",
    minAPS: 18,
    maxAPS: 26,
    website: "https://www.ul.ac.za",
    overview: "UL is the only comprehensive university in Limpopo province, offering programs with a particular focus on rural community development and health.",
    faculties: [
      { name: "Faculty of Health Sciences", minAPS: 24, programs: ["Medicine (MBChB)", "Pharmacy", "Nursing"] },
      { name: "Faculty of Humanities", minAPS: 18, programs: ["BA (various)", "Social Work", "Communication Studies"] },
      { name: "Faculty of Management & Law", minAPS: 20, programs: ["BCom (various)", "LLB", "Public Administration"] },
      { name: "Faculty of Science & Agriculture", minAPS: 20, programs: ["BSc (various)", "Agriculture", "Environmental Science"] },
    ],
    admissionNotes: "Serves predominantly rural communities in Limpopo. Affordable fees. Strong support systems for first-generation students.",
  },
  "13": {
    name: "Tshwane University of Technology",
    location: "Pretoria, Gauteng",
    minAPS: 18,
    maxAPS: 28,
    website: "https://www.tut.ac.za",
    overview: "TUT is one of South Africa's largest universities of technology, offering career-focused qualifications with strong industry partnerships across multiple campuses.",
    faculties: [
      { name: "Faculty of Engineering & the Built Environment", minAPS: 24, programs: ["Civil Engineering Technology", "Electrical Engineering", "Mechanical Engineering"] },
      { name: "Faculty of ICT", minAPS: 22, programs: ["BSc IT", "Computer Systems", "Network Engineering"] },
      { name: "Faculty of Arts & Design", minAPS: 18, programs: ["Fine Arts", "Graphic Design", "Fashion Design"] },
      { name: "Faculty of Management Sciences", minAPS: 20, programs: ["Business Administration", "Public Management", "Hospitality Management"] },
    ],
    admissionNotes: "Largest university of technology in SA. Multiple campuses nationwide. Practical, industry-oriented qualifications (Diplomas & BTech).",
  },
  "14": {
    name: "Cape Peninsula University of Technology",
    location: "Cape Town, Western Cape",
    minAPS: 18,
    maxAPS: 26,
    website: "https://www.cput.ac.za",
    overview: "CPUT is the only university of technology in the Western Cape, offering vocational and professional programs with a focus on innovation and entrepreneurship.",
    faculties: [
      { name: "Faculty of Engineering & the Built Environment", minAPS: 22, programs: ["Civil Engineering", "Electrical Engineering", "Surveying"] },
      { name: "Faculty of Business & Management Sciences", minAPS: 20, programs: ["BCom (various)", "Retail Business Management", "Tourism"] },
      { name: "Faculty of Health & Wellness Sciences", minAPS: 22, programs: ["Environmental Health", "Radiography", "Sports Management"] },
      { name: "Faculty of Informatics & Design", minAPS: 18, programs: ["Graphic Design", "Multimedia Technology", "Fashion"] },
    ],
    admissionNotes: "Multiple campuses across Cape Town. Strong workplace integrated learning programs. Good links to the Western Cape economy.",
  },
  "15": {
    name: "Durban University of Technology",
    location: "Durban, KwaZulu-Natal",
    minAPS: 18,
    maxAPS: 26,
    website: "https://www.dut.ac.za",
    overview: "DUT is a dynamic university of technology in Durban offering professional and vocational qualifications with strong community and industry connections.",
    faculties: [
      { name: "Faculty of Engineering & the Built Environment", minAPS: 22, programs: ["Mechanical Engineering", "Civil Engineering Technology", "Chemical Engineering"] },
      { name: "Faculty of Health Sciences", minAPS: 22, programs: ["Biomedical Technology", "Environmental Health", "Dental Technology"] },
      { name: "Faculty of Management Sciences", minAPS: 18, programs: ["Marketing", "Public Management", "Hospitality"] },
      { name: "Faculty of Arts & Design", minAPS: 18, programs: ["Fashion", "Performing Arts", "Visual Communication"] },
    ],
    admissionNotes: "Located in Durban's city centre. Strong practical training focus. Extensive work-integrated learning components.",
  },
  "16": {
    name: "Sefako Makgatho Health Sciences University",
    location: "Ga-Rankuwa, Gauteng",
    minAPS: 28,
    maxAPS: 38,
    website: "https://www.smu.ac.za",
    overview: "SMU is a dedicated health sciences university, formerly part of the University of Limpopo Medical School, serving predominantly underserved communities in South Africa.",
    faculties: [
      { name: "Faculty of Medicine", minAPS: 36, programs: ["MBChB (Medicine)", "Sports Medicine"] },
      { name: "Faculty of Dentistry", minAPS: 34, programs: ["BChD (Dentistry)", "Oral Hygiene"] },
      { name: "Faculty of Pharmacy", minAPS: 30, programs: ["BPharm", "Clinical Pharmacy"] },
      { name: "Faculty of Health Care Sciences", minAPS: 28, programs: ["Nursing", "Physiotherapy", "Occupational Therapy"] },
    ],
    admissionNotes: "Specialised health sciences institution. Small intake with competitive selection. Located north of Pretoria in Ga-Rankuwa.",
  },
};

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
