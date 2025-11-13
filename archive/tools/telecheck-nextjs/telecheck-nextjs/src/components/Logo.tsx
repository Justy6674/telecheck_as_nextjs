interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "h-6 w-6" }: LogoProps) => {
  return (
    <img 
      src="/telecheck-favicon.png" 
      alt="TeleCheck logo" 
      className={className}
    />
  );
};