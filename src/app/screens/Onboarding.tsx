import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Calculator, School, TrendingUp, ChevronRight } from "lucide-react";
import { Button } from "../components/Button";

const slides = [
  {
    icon: Calculator,
    title: "What is APS?",
    description: "Admission Point Score (APS) is calculated using your Grade 12 subject marks. Each mark range earns you a specific number of points.",
    color: "from-primary to-primary/80",
  },
  {
    icon: TrendingUp,
    title: "Calculate Your Score",
    description: "Simply enter your Grade 12 subjects and marks. We'll instantly calculate your total APS score and show you exactly where you stand.",
    color: "from-secondary to-secondary/80",
  },
  {
    icon: School,
    title: "Discover Universities",
    description: "Based on your APS, we'll match you with South African universities and programs you qualify for. Compare options and make informed decisions.",
    color: "from-info to-info/80",
  },
];

export function Onboarding() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/home");
    }
  };

  const handleSkip = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="flex justify-end mb-8">
        <button
          onClick={handleSkip}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className={`w-32 h-32 mx-auto mb-8 bg-gradient-to-br ${slides[currentSlide].color} rounded-full flex items-center justify-center shadow-2xl`}
            >
              {(() => {
                const Icon = slides[currentSlide].icon;
                return <Icon size={64} className="text-white" strokeWidth={2} />;
              })()}
            </motion.div>

            <h2 className="text-3xl mb-4 text-foreground">
              {slides[currentSlide].title}
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-sm mx-auto">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          variant="success"
          size="lg"
          fullWidth
        >
          {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
          <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
}
