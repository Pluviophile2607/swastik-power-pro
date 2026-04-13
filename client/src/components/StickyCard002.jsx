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
        // Subtle stacking effect without transparency or scale to ensure clarity
        if (i !== cardElements.length - 1) {
          gsap.to(card, {
            // Keep scale 1 to prevent text blurring/ghosting on some viewports
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
    <div ref={containerRef} className={`relative flex flex-col items-center gap-[5vh] pb-[5vh] ${className}`}>
      {cards.map((card, i) => (
        <div 
          key={card.id} 
          className={`card-item sticky top-[100px] w-full max-w-7xl rounded-[40px] bg-white border border-slate-100 shadow-2xl p-6 md:p-8 overflow-hidden isolate ${containerClassName}`}
          style={{ zIndex: i + 1 }}
        >
          {/* Solid Background Layer to prevent any ghosting */}
          <div className="absolute inset-0 bg-white z-[-1]"></div>
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-stretch h-full">
            {/* Left: Image Section */}
            <div className="w-full md:w-2/5 h-[200px] md:h-auto flex-shrink-0 relative">
               <img 
                 src={card.image} 
                 alt={card.title} 
                 className="w-full h-full object-cover object-center rounded-[30px] shadow-lg transition-transform duration-700 hover:scale-105 md:absolute md:inset-0"
               />
            </div>

            {/* Right: Content Section */}
            <div className="flex-grow flex flex-col justify-between py-2 space-y-6 md:space-y-0 text-left">
               <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border border-slate-100">
                       {card.category}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-spp-navy leading-[1.2] tracking-tight max-w-xl">
                       {card.title}
                    </h2>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-xl">
                       {card.desc}
                    </p>
                  </div>

                  {/* Stats Grid inspired by reference */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 mt-4 border-t border-slate-100/60">
                     <div className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 transition-transform group-hover:scale-110">
                           <Clock size={18} />
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Project Date</p>
                           <p className="text-xs font-black text-spp-navy uppercase">04.02.2025</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 transition-transform group-hover:scale-110">
                           <ShieldCheck size={18} />
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Certification</p>
                           <p className="text-xs font-black text-spp-navy uppercase">Verified Spec</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500 transition-transform group-hover:scale-110">
                           <Globe size={18} />
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Network</p>
                           <p className="text-xs font-black text-spp-navy uppercase">Regional Distrib</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-spp-navy transition-transform group-hover:scale-110">
                           {card.icon || <CheckCircle2 size={18} />}
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Operational</p>
                           <p className="text-xs font-black text-spp-navy uppercase max-w-[120px] truncate">{card.status}</p>
                        </div>
                     </div>
                  </div>
               </div>


            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
