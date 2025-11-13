import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface BWHeroProps {
  title: string;
  subtitle?: string;
  description?: string | ReactNode;
  backgroundImage?: string;
  children?: ReactNode;
  className?: string;
  titleClassName?: string;
  compact?: boolean;
  bottomContent?: ReactNode;
}

export const BWHero = ({
  title,
  subtitle,
  description,
  backgroundImage,
  children,
  className,
  titleClassName,
  compact = false,
  bottomContent,
}: BWHeroProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (backgroundImage) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.src = backgroundImage;
    }
  }, [backgroundImage]);

  return (
    <section 
      className={cn(
        "relative overflow-hidden",
        compact ? "py-4 sm:py-6" : "min-h-screen py-4 sm:py-6 lg:py-12",
        !backgroundImage && "red-spot",
        className
      )}
    >
      {backgroundImage && (
        <div 
          className={cn(
            "absolute inset-0 bg-cover bg-no-repeat transition-opacity duration-500",
            "bg-[position:15%_center] sm:bg-[position:25%_center] md:bg-[position:45%_center] lg:bg-[position:55%_center] xl:bg-[position:center_center]",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundAttachment: isMobile ? 'scroll' : 'fixed',
            willChange: 'transform',
          }}
        />
      )}

      {backgroundImage && !imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 animate-pulse" />
      )}
      
      {backgroundImage && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-full w-full bg-black/55 sm:bg-black/45 md:bg-black/30 lg:bg-black/20" />
          <div className="h-full w-full bg-gradient-to-r from-black/75 via-black/45 sm:via-black/35 md:via-black/20 lg:via-black/10 to-transparent" />
        </div>
      )}
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 md:px-8 h-full min-h-[95vh] flex items-center justify-center py-6">
        <div className="w-full max-w-7xl text-center px-4 sm:px-6 lg:px-8">
          <h1 className={cn(
            "font-black mb-3 sm:mb-4 leading-tight tracking-tight drop-shadow-2xl",
            // Bigger on desktop + darker red gradient
            "text-5xl sm:text-6xl md:text-7xl lg:text-[10rem] xl:text-[13rem]",
            "bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent",
            titleClassName
          )}>
            {title.includes('|') ? (
              title.split('|').map((part, index) => (
                <span key={index}>
                  {index === 0 ? part : <span className="inline-block">{part}</span>}
                  {index < title.split('|').length - 1 && <br />}
                </span>
              ))
            ) : (
              <span className="inline-block">{title}</span>
            )}
          </h1>
          
          {subtitle && (
            <h2 className="font-extrabold mb-5 sm:mb-7 pb-1 md:pb-2 max-w-6xl mx-auto drop-shadow-[0_6px_24px_rgba(0,0,0,0.45)] bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl leading-snug">
              {subtitle}
            </h2>
          )}
          
          {description && (
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-md">
              {description}
            </p>
          )}

          {children}
        </div>
      </div>

      {bottomContent && (
        <div className="relative z-10 mt-6 sm:mt-8 md:mt-10 lg:mt-12">
          <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto rounded-xl bg-background/80 backdrop-blur-md ring-1 ring-border/40 p-4 sm:p-6">{bottomContent}</div>
          </div>
        </div>
      )}
    </section>
  );
};