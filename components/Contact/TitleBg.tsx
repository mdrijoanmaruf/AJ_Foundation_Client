import React from "react";

type TitleBgProps = {
  title: string;
  subtitle?: React.ReactNode;
  image?: string;
  className?: string;
};

const TitleBg = ({
  title,
  subtitle,
  image = "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=2070&auto=format&fit=crop",
  className = "mb-12",
}: TitleBgProps) => {
  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${image}')` }}
        aria-hidden
      >
        <div className="absolute inset-0 bg-black/65" />
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl pt-22 sm:text-4xl font-bold text-white mb-3">{title}</h1>
          {subtitle ? (
            <div className="text-lg text-white/90 max-w-2xl mx-auto">{subtitle}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TitleBg;