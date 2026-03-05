import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

const PageHeader = ({ title, subtitle, badge }: PageHeaderProps) => {
  return (
    <section className="bg-navy-gradient pt-28 pb-16">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        {badge && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium mb-6 text-gold"
            style={{ borderColor: "hsl(38 92% 50% / 0.3)", background: "hsl(38 92% 50% / 0.08)" }}
          >
            {badge}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold mb-4"
          style={{ color: "hsl(0 0% 96%)" }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg max-w-2xl mx-auto"
            style={{ color: "hsl(220 20% 65%)" }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
};

export default PageHeader;
