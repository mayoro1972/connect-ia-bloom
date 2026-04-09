import headerBg from "@/assets/header-bg.jpg";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

const PageHeader = ({ title, subtitle, badge }: PageHeaderProps) => {
  return (
    <section className="relative overflow-hidden pb-16 pt-28 lg:pt-32">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={headerBg} alt="" className="w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, hsl(225 55% 10% / 0.85), hsl(220 50% 16% / 0.9))",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
        {badge && (
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium mb-6"
            style={{
              borderColor: "hsl(15 85% 57% / 0.3)",
              background: "hsl(15 85% 57% / 0.1)",
              color: "hsl(15 85% 65%)",
            }}
          >
            {badge}
          </span>
        )}
        <h1
          className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold mb-4"
          style={{ color: "hsl(0 0% 98%)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: "hsl(210 20% 75%)" }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default PageHeader;
