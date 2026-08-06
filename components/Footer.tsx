import Link from "next/link";
import { navigation } from "@/lib/data";
import { Logo } from "./Header";

export function Footer() {
  return (
    <footer className="bg-ink text-white pt-[90px] px-pad pb-[24px] border-t border-[#262626] max-[809.98px]:pt-[70px] max-[809.98px]:px-[20px] max-[809.98px]:pb-[20px]">
      <div className="flex justify-between max-[809.98px]:block">
        <div>
          <Logo />
          <p className="text-[#777] mt-[28px]">
            Independent creative studio for brands<br />
            that refuse to blend in.
          </p>
        </div>
        <div className="flex gap-[110px] max-[809.98px]:mt-[50px] max-[809.98px]:gap-[70px]">
          <div className="flex flex-col gap-[12px]">
            <strong className="font-medium text-[10px] font-mono text-[#666] mb-[9px]">NAVIGATE</strong>
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="text-[15px] hover:text-red">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-[12px]">
            <strong className="font-medium text-[10px] font-mono text-[#666] mb-[9px]">SOCIAL</strong>
            <a href="https://instagram.com" rel="noreferrer" className="text-[15px] hover:text-red">Instagram</a>
            <a href="https://www.behance.net" rel="noreferrer" className="text-[15px] hover:text-red">Behance</a>
            <a href="https://linkedin.com" rel="noreferrer" className="text-[15px] hover:text-red">LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="font-normal text-[25vw] max-[809.98px]:text-[30vw] leading-[0.76] font-display tracking-[-1.3vw] text-red text-center mt-[100px] max-[1199.98px]:mt-[80px] max-[809.98px]:mt-[90px] mb-[40px] max-[809.98px]:mb-[35px]">
        AEXO
      </div>
      <div className="border-t border-[#282828] pt-[20px] flex justify-between text-[#666] font-medium text-[9px] font-mono max-[809.98px]:gap-[15px] max-[809.98px]:flex-wrap">
        <span>© 2026 AEXO STUDIO</span>
        <div className="flex gap-[24px]">
          <Link href="/policy/our-privacy-policy">Privacy</Link>
          <Link href="/policy/our-terms-conditions">Terms</Link>
        </div>
        <span className="max-[809.98px]:hidden">MADE WITH INTENTION</span>
      </div>
    </footer>
  );
}
