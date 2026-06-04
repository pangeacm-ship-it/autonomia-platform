import Image from "next/image";

type LogoProps = {
  priority?: boolean;
};

export default function Logo({ priority = false }: LogoProps) {
  return (
    <div className="flex items-center">
      <Image
        src="/autonomia-logo-navbar.png"
        alt="AutonomIA"
        width={260}
        height={70}
        priority={priority}
      />
    </div>
  );
}
