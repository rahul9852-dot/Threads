import { OrganizationSwitcher, SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import {dark} from "@clerk/themes"
function Topbar(){

  const isUseloggedIn = true;
  return (
    <nav className="topbar">
      <Link href="/" className="flex items-center gap-4">
        <Image 
          src="/assets/logo.svg" 
          width={28} 
          height={28} 
          alt="not found"
        />
        <p className="text-heading2-bold text-light-1 max-xs:hidden">Threads</p>
      </Link>

      <div className="flex items-center gap-1">
        <div className="block md:hidden">
            <SignedIn>
              <SignOutButton>
                <div className="flex cursor-pointer">
                  <Image
                    src="/assets/logout.svg"
                    alt="LogOut"
                    width={24}
                    height={24}
                  />
                </div>
              </SignOutButton>
            </SignedIn>
        </div>

        <OrganizationSwitcher 
          appearance={{
            baseTheme:dark,
            elements:{
              organizationSwitcherTrigger:
              "py-2 px-4"
            }
          }}
        />
      </div>
    </nav>
  )
}

export default Topbar;