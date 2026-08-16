import React from 'react';
import { Award, ShieldCheck, Users2, Leaf } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-asphalt min-h-screen text-chalk pt-20 pb-20">
      {/* Hero section */}
      <div className="bg-graphite text-chalk py-24 px-6 text-center border-b border-white/5">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="text-[9px] font-bold text-neon-accent uppercase tracking-[0.3em] block">
            OUR JOURNEY
          </span>
          <h1 className="text-4xl sm:text-6xl font-display uppercase tracking-widest text-chalk">ABOUT TORQUE</h1>
          <p className="text-silver text-xs leading-relaxed max-w-lg mx-auto pt-2 uppercase tracking-wider">
            Redefining vehicle configurations through technological telemetry, curated luxury fleets, and custom support interfaces.
          </p>
        </div>
      </div>

      {/* Grid Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 space-y-24">
        
        {/* Mission Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[9px] font-bold text-silver tracking-widest uppercase block">01 / CONCEPT</span>
            <h2 className="text-3xl font-display text-chalk tracking-widest uppercase">OUR MISSION</h2>
            <p className="text-silver/80 leading-relaxed text-xs uppercase tracking-wider">
              At TORQUE, we believe transport configurations should be absolute. We strive to offer a friction-free booking platform that connects travelers, business professionals, and automotive enthusiasts to a premium fleet matching their specific needs.
            </p>
            <p className="text-silver/60 leading-relaxed text-xs uppercase tracking-wider">
              We continually invest in electric propulsion adoption, dynamic vehicle cleanliness validation, and availability schedules to guarantee that when you configure, the vehicle is fully charged, prepared, and awaiting your command.
            </p>
          </div>
          <div className="relative aspect-video overflow-hidden bg-graphite border border-white/5">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
              alt="Porsche 911"
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        </div>

        {/* Pillars / Values */}
        <div className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[9px] font-bold text-silver tracking-widest uppercase block">02 / CORE TELEMETRY</span>
            <h2 className="text-3xl font-display text-chalk uppercase tracking-widest">WHAT'S YOUR VALUE?</h2>
            <p className="text-silver/60 text-xs uppercase tracking-widest">The operational metrics that underpin our daily fleet config.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-graphite/40 p-6 border border-white/5 space-y-4">
              <div className="w-12 h-12 bg-asphalt text-neon-accent border border-white/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-chalk uppercase text-xs tracking-wider">Safety Diagnostics</h3>
              <p className="text-[10px] text-silver/70 leading-relaxed uppercase tracking-wider">
                Every vehicle undergoes rigorous mechanical and cleanliness safety diagnostics prior to system configuration.
              </p>
            </div>

            <div className="bg-graphite/40 p-6 border border-white/5 space-y-4">
              <div className="w-12 h-12 bg-asphalt text-neon-accent border border-white/10 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-chalk uppercase text-xs tracking-wider">Showroom Standards</h3>
              <p className="text-[10px] text-silver/70 leading-relaxed uppercase tracking-wider">
                We curate only top-tier trims, ensuring advanced telemetry cameras, virtual cockpits, and premium acoustic parameters.
              </p>
            </div>

            <div className="bg-graphite/40 p-6 border border-white/5 space-y-4">
              <div className="w-12 h-12 bg-asphalt text-neon-accent border border-white/10 flex items-center justify-center">
                <Users2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-chalk uppercase text-xs tracking-wider">Support Grid</h3>
              <p className="text-[10px] text-silver/70 leading-relaxed uppercase tracking-wider">
                Our operations agents are online 24/7/365 to handle reservations configurations or telemetry adjustments.
              </p>
            </div>

            <div className="bg-graphite/40 p-6 border border-white/5 space-y-4">
              <div className="w-12 h-12 bg-asphalt text-neon-accent border border-white/10 flex items-center justify-center">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-chalk uppercase text-xs tracking-wider">Eco Configuration</h3>
              <p className="text-[10px] text-silver/70 leading-relaxed uppercase tracking-wider">
                We are actively transitioning our fleet to electric and hybrid drive systems to offset carbon-heavy travel.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
