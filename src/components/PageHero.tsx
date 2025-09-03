'use client';

interface PageHeroProps {
  title: React.ReactNode;
  subtitle: string;
  backgroundGradient?: string;
  className?: string;
  children?: React.ReactNode;
}

const PageHero = ({ 
  title, 
  subtitle, 
  backgroundGradient = 'from-blue-50 to-indigo-100',
  className = '',
  children 
}: PageHeroProps) => {
  return (
    <section className={`bg-gradient-to-br ${backgroundGradient} py-20 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up">
          {title}
        </h1>
        <p className="text-xl text-gray-600 animate-fade-in-up animation-delay-200">
          {subtitle}
        </p>
        {children && (
          <div className="animate-fade-in-up animation-delay-600">
            {children}
          </div>
        )}
      </div>
    </section>
  );
};

export default PageHero;