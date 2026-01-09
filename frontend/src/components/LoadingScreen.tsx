import { motion } from "framer-motion";
import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-black via-slate-900 to-black flex items-center justify-center z-50">
      <div className="relative">
        {/* Pulsing Glow Effect */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 blur-3xl bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
        />

        {/* Rotating Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 -m-8"
        >
          <svg className="w-full h-full" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="url(#ringGradient)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="20 10"
              opacity="0.5"
            />
          </svg>
        </motion.div>

        {/* Logo Container with Animations */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ 
            scale: 1, 
            rotate: 0,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
          className="relative z-10"
        >
          {/* Floating Animation */}
          <motion.div
            animate={{
              y: [-10, 10, -10],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Pulse Animation */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Image
                src="/logo.png"
                alt="Metrix Logo"
                width={120}
                height={120}
                className="drop-shadow-2xl"
                priority
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Orbiting Dots */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.4,
            }}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `rotate(${i * 120}deg)`,
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-orange-500 absolute"
              style={{
                top: '-20px',
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
