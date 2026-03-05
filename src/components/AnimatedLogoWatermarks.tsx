import { motion } from "framer-motion";
import logoTransferAI from "@/assets/logo-academie-ia-afrique.png";

const AnimatedLogoWatermarks = () => (
  <>
    <motion.img
      src={logoTransferAI}
      alt=""
      className="pointer-events-none select-none absolute top-32 -right-24 w-[420px] h-[420px] object-contain"
      style={{ opacity: 0.08 }}
      animate={{ rotate: [0, 360], scale: [1, 1.08, 1] }}
      transition={{ rotate: { duration: 90, repeat: Infinity, ease: "linear" }, scale: { duration: 12, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" } }}
    />
    <motion.img
      src={logoTransferAI}
      alt=""
      className="pointer-events-none select-none absolute top-[60%] -left-32 w-[350px] h-[350px] object-contain"
      style={{ opacity: 0.06 }}
      animate={{ rotate: [360, 0], scale: [1, 1.1, 1] }}
      transition={{ rotate: { duration: 120, repeat: Infinity, ease: "linear" }, scale: { duration: 15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" } }}
    />
    <motion.img
      src={logoTransferAI}
      alt=""
      className="pointer-events-none select-none absolute bottom-20 right-10 w-[280px] h-[280px] object-contain"
      style={{ opacity: 0.05 }}
      animate={{ rotate: [0, -360], y: [0, -20, 0] }}
      transition={{ rotate: { duration: 100, repeat: Infinity, ease: "linear" }, y: { duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" } }}
    />
  </>
);

export default AnimatedLogoWatermarks;
