import { FaSkullCrossbones } from "react-icons/fa";

type SkullIconProps = {
  size?: number;
  className?: string;
};

export function SkullIcon({ size = 48, className = "" }: SkullIconProps) {
  return (
    <FaSkullCrossbones
      size={size}
      className={className}
    />
  );
}
