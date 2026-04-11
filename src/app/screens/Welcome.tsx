import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { GraduationCap, TrendingUp, Award } from "lucide-react";
import { Button } from "../components/Button";

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary via-primary/95 to-secondary/80 text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col justify-center items-center text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8 relative"
        >
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center backdrop-blur-sm overflow-hidden">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/my-univen-project.firebasestorage.app/o/ChatGPT%20Image%20Feb%2016%2C%202026%2C%2010_40_33%20AM.png?alt=media&token=99a62911-665e-4997-94cb-46f47f56d17e"
              alt="Gradiate badge"
              className="auth-badge__image w-50 h-50 mt-3 object-cover"
              referrerPolicy="no-referrer"
              />
            </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
            className="absolute -top-2 -right-2 w-12 h-12 bg-accent rounded-full flex items-center justify-center"
          >
            <Award size={24} className="text-accent-foreground" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl mb-4 tracking-tight"
        >
          APS Calculator
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-white/90 mb-2 max-w-sm leading-relaxed"
        >
          Calculate your APS and discover your university opportunities
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 text-white/80 mb-12"
        >
          <TrendingUp size={20} />
          <span className="text-sm">Trusted by thousands of South African learners</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full space-y-4"
        >
          <Button
            onClick={() => navigate("/onboarding")}
            variant="secondary"
            size="lg"
            fullWidth
            className="shadow-xl"
          >
            Get Started
          </Button>

          <Button
            onClick={() => navigate("/home")}
            variant="ghost"
            size="lg"
            fullWidth
            className="text-white border-2 border-white/30 hover:bg-white/10"
          >
            Skip to Home
          </Button>
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-white/60 text-sm"
      >
        Your journey to university starts here
      </motion.p>
    </div>
  );
}
