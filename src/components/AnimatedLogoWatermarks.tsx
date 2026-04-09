import logoTransferAI from "@/assets/logo-academie-ia-afrique.png";

const AnimatedLogoWatermarks = () => (
  <>
    <img
      src={logoTransferAI}
      alt=""
      className="pointer-events-none select-none absolute top-32 -right-24 w-[420px] h-[420px] object-contain"
      style={{ opacity: 0.08 }}
    />
    <img
      src={logoTransferAI}
      alt=""
      className="pointer-events-none select-none absolute top-[60%] -left-32 w-[350px] h-[350px] object-contain"
      style={{ opacity: 0.06 }}
    />
    <img
      src={logoTransferAI}
      alt=""
      className="pointer-events-none select-none absolute bottom-20 right-10 w-[280px] h-[280px] object-contain"
      style={{ opacity: 0.05 }}
    />
  </>
);

export default AnimatedLogoWatermarks;
