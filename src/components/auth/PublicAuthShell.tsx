import { BookOpen, GraduationCap, LineChart } from "lucide-react";
import type { ReactNode } from "react";
import logonsImg from "@/assets/NS.png";
import wiziLogo from "@/assets/logo.png";

interface PublicAuthShellProps {
  children: ReactNode;
  eyebrow?: string;
  title?: string;
  description?: string;
}

export function PublicAuthShell({
  children,
  eyebrow = "ESPACE APPRENANT",
  title = "Faites grandir vos compétences, une étape à la fois.",
  description = "Retrouvez vos formations, vos quiz et votre progression dans un espace conçu pour apprendre avec confiance.",
}: PublicAuthShellProps) {
  return (
    <main className="min-h-screen bg-[#eaf2f0] px-4 py-6 text-slate-900 sm:px-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center justify-center sm:min-h-[calc(100vh-5rem)]">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-[#d3e2de] bg-[#fbfaf6] shadow-[0_24px_70px_rgba(30,63,68,0.16)] md:grid-cols-[0.92fr_1.08fr]">
          <section className="relative hidden overflow-hidden bg-[#263548] p-10 text-white md:flex md:flex-col md:justify-between lg:p-14">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[36px] border-[#f6b72b]/20" />
            <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#2f6870]/50" />
            <div className="relative">
              <div className="mb-12 flex items-center gap-4">
                <img src={logonsImg} alt="NS Conseil" className="size-16 w-auto " />
                <span className="h-8 w-px bg-white/25" />
                <img src={wiziLogo} alt="Wizi Learn" className="size-16 w-auto" />
              </div>
              <p className="mb-4 text-xs font-bold tracking-[0.22em] text-[#f6c454]">{eyebrow}</p>
              <h1 className="max-w-md font-poppins text-3xl font-semibold leading-tight lg:text-4xl">{title}</h1>
              <p className="mt-5 max-w-md text-sm leading-7 text-[#d7e8e5]">{description}</p>
            </div>
            <div className="relative grid grid-cols-3 gap-3 pt-12 text-[#d7e8e5]">
              <div className="border-l border-white/20 pl-3"><BookOpen className="mb-3 h-5 w-5 text-[#f6c454]" /><span className="text-xs leading-5">Formations ciblées</span></div>
              <div className="border-l border-white/20 pl-3"><LineChart className="mb-3 h-5 w-5 text-[#f6c454]" /><span className="text-xs leading-5">Progression visible</span></div>
              <div className="border-l border-white/20 pl-3"><GraduationCap className="mb-3 h-5 w-5 text-[#f6c454]" /><span className="text-xs leading-5">Objectifs atteignables</span></div>
            </div>
          </section>
          <section className="flex min-h-[560px] flex-col justify-center px-6 py-10 sm:px-12 lg:px-16">
            <div className="mb-8 flex flex-col items-center md:hidden">
              <div className="flex items-center gap-3"><img src={logonsImg} alt="NS Conseil" className="h-10 w-auto" /><span className="h-8 w-px bg-slate-200" /><img src={wiziLogo} alt="Wizi Learn" className="h-10 w-auto" /></div>
              <p className="mt-4 text-center text-sm font-medium text-[#42636a]">Apprendre. Progresser. Réussir.</p>
            </div>
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}