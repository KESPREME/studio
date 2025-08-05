"use client";

import { Header } from "@/components/header";
import { ReportForm } from "@/components/report-form";
import withAuth from "@/components/with-auth";
import { AnimatedCard } from "@/components/animated-card";
import { FloatingElementsPurple } from "@/components/floating-elements";
import { motion } from "framer-motion";
import { AlertTriangle, MapPin, Camera, Send } from "lucide-react";

function NewReportPage() {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const headerVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { delay: 0.2, duration: 0.5 }
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.4, duration: 0.6 }
    }
  };

  const iconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: { delay: 0.6, duration: 0.5, type: "spring" }
    }
  };

  return (
    <motion.div 
      className="flex flex-col min-h-screen relative overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <FloatingElementsPurple />
      
      {/* Enhanced Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-slate-900/50 dark:via-purple-950/30 dark:to-slate-800/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]" />
      </div>

      <Header />
      
      <main className="flex-1 p-4 sm:p-6 md:p-8 relative">
        <div className="max-w-4xl mx-auto">
          {/* Enhanced Header Section */}
          <motion.div 
            className="text-center mb-12"
            variants={headerVariants}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.div
                className="p-4 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl shadow-lg"
                variants={iconVariants}
              >
                <AlertTriangle className="h-8 w-8 text-white" />
              </motion.div>
              <motion.div
                className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg"
                variants={iconVariants}
                style={{ animationDelay: "0.1s" }}
              >
                <MapPin className="h-8 w-8 text-white" />
              </motion.div>
              <motion.div
                className="p-4 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl shadow-lg"
                variants={iconVariants}
                style={{ animationDelay: "0.2s" }}
              >
                <Camera className="h-8 w-8 text-white" />
              </motion.div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold font-headline bg-gradient-to-r from-slate-800 via-purple-600 to-slate-800 dark:from-slate-200 dark:via-purple-400 dark:to-slate-200 bg-clip-text text-transparent mb-4">
              Report a Hazard
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Help keep your community safe by reporting hazards, emergencies, or safety concerns. 
              Your report helps emergency responders act quickly and effectively.
            </p>
            
            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-3xl mx-auto">
              <motion.div 
                className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">GPS Location</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Automatic location detection</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Camera className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">Photo Upload</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Visual evidence support</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/20"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
              >
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Send className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">Instant Alert</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Real-time notifications</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Report Form */}
          <motion.div
            variants={cardVariants}
          >
            <AnimatedCard
              variant="glass"
              hover3d={false}
              glowColor="purple"
              className="max-w-2xl mx-auto"
            >
              <ReportForm />
            </AnimatedCard>
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
}

export default withAuth(NewReportPage, { roles: ['reporter', 'admin'] });
