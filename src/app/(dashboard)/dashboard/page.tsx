import LogoutButton from "@/components/auth/LogoutButton";

import Logo from "@/../public/logo.svg";
import LogoWide from "@/../public/logo-wide.svg";
import Image from "next/image";

const DashboardPage = () => {
  return (
    <div>

      {/* set size 45 for sidebar/navbar */}
      
      <Image src={Logo} alt="logo" width={85} height={85} />
      <Image src={LogoWide} alt="logo" height={85} />
      <p>DashboardPage</p>
      <LogoutButton />
    </div>
  );
};

export default DashboardPage;
