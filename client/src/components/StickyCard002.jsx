import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, Globe, ShieldCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const StickyCard002 = ({ cards, className, containerClassName }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cardElements = gsap.utils.toArray('.card-item');
      
      cardElements.forEach((card, i) => {
        if (i !== cardElements.length - 1) {
          gsap.to(card, {
            scale: 1,
            scrollTrigger: {
              trigger: card,
              start: 'top top+=100',
              endTrigger: cardElements[i + 1],
              end: 'top top+=100',
              scrub: true,
            },
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [cards]);

  return (
    <div ref={containerRef} className={`relative flex flex-col items-center gap-[4vh] md:gap-[5vh] pb-[10vh] ${className}`}>
      {cards.map((card, i) => (
        <div
          key={card.id}
          className={`card-item sticky top-[80px] md:top-[100px] w-full max-w-7xl rounded-[24px] md:rounded-[40px] bg-white border border-slate-100 shadow-xl overflow-hidden isolate ${containerClassName}`}
          style={{ zIndex: i + 1 }}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-white z-[-1]"></div>

          {/* Card Body: Side-by-side on desktop, stacked on mobile */}
          <div className="flex flex-col md:flex-row items-stretch" style={{ minHeight: 'clamp(260px, 45vh, 520px)' }}>

            {/* LEFT — Full-bleed image, no padding */}
            <div className="w-full md:w-[42%] h-[200px] md:h-auto flex-shrink-0 relative overflow-hidden group/img">
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[1.5s] ease-out group-hover/img:scale-105"
              />
              {/* Subtle darkening veil */}
              <div className="absolute inset-0 bg-spp-navy/10 group-hover/img:bg-transparent transition-colors duration-700 pointer-events-none"></div>
            </div>

            {/* RIGHT — Content, padded */}
            <div className="flex-grow flex flex-col justify-center p-6 sm:p-8 md:p-10 lg:p-14 gap-6 md:gap-10">
              {/* Title + Description */}
              <div className="space-y-3 md:space-y-5">
                <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-spp-navy leading-[1.05] tracking-tighter uppercase italic">
                  {card.title}
                </h2>
                <p className="text-sm md:text-base lg:text-[1.05rem] text-slate-500 font-medium leading-relaxed max-w-lg">
                  {card.desc}
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4 md:gap-6 pt-6 md:pt-8 border-t border-slate-100">
                {/* Date */}
                <div className="flex items-center gap-3 md:gap-4 group/stat">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-spp-navy/40 group-hover/stat:bg-orange-50 group-hover/stat:text-orange-500 group-hover/stat:border-orange-100 transition-all duration-300">
                    <Clock className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] leading-none mb-1">Project Date</p>
                    <p className="text-xs md:text-sm font-black text-spp-navy uppercase">04.02.2025</p>
                  </div>
                </div>

                {/* Certification */}
                <div className="flex items-center gap-3 md:gap-4 group/stat">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-spp-navy/40 group-hover/stat:bg-blue-50 group-hover/stat:text-blue-500 group-hover/stat:border-blue-100 transition-all duration-300">
                    <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] leading-none mb-1">Certification</p>
                    <p className="text-xs md:text-sm font-black text-spp-navy uppercase">Verified Spec</p>
                  </div>
                </div>

                {/* Network */}
                <div className="flex items-center gap-3 md:gap-4 group/stat">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-spp-navy/40 group-hover/stat:bg-green-50 group-hover/stat:text-green-500 group-hover/stat:border-green-100 transition-all duration-300">
                    <Globe className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] leading-none mb-1">Network Tier</p>
                    <p className="text-xs md:text-sm font-black text-spp-navy uppercase">Regional Hub</p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-3 md:gap-4 group/stat">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-spp-navy/40 group-hover/stat:bg-spp-navy group-hover/stat:text-neon-lime group-hover/stat:border-spp-navy transition-all duration-300">
                    {card.icon ? React.cloneElement(card.icon, { className: 'w-4 h-4 md:w-5 md:h-5' }) : <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] leading-none mb-1">Status</p>
                    <p className="text-xs md:text-sm font-black text-spp-navy uppercase truncate">{card.status}</p>
                  </div>
                </div>
              </div>

              {/* Mobile swipe hint */}
              <div className="flex items-center gap-2 md:hidden">
                <span className="text-[9px] font-black text-spp-navy/30 uppercase tracking-widest">Scroll to Discover</span>
                <ArrowRight size={11} className="text-neon-lime animate-pulse" />
              </div>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
};
