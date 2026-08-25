"use client";

import Image from "next/image";
import { MapPin, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-white font-sans">

      {/* ── HERO: slim professional page header ── */}
      <section className="relative w-full bg-zinc-950 overflow-hidden border-b border-zinc-800">
        {/* subtle dot-grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, #666 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* decorative faded logo */}
        <div
          aria-hidden
          className="absolute right-6 top-1/2 -translate-y-1/2 opacity-[0.07] pointer-events-none select-none"
        >
          <Image
            src="/new_logo.png"
            alt=""
            width={220}
            height={220}
            className="object-contain grayscale"
            priority={false}
          />
        </div>

        {/* Hero text — compact */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-10 md:py-12">
          {/* breadcrumb label */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-[2px] bg-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500">
              Contact Us
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2">
            Let&apos;s Connect<span className="text-red-600">.</span>
          </h1>

          <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
            Open to ideas, feedback, collaborations and conversations —
            reach out to us anytime.
          </p>
        </div>
      </section>

      {/* ── INFO SECTION ── */}
      <section className="bg-zinc-100 py-14 md:py-16">
        <div className="max-w-5xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 md:gap-16">

          {/* LEFT — Contact Information */}
          <div>
            {/* section label */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-red-600">
                Contact Information
              </span>
              <div className="flex-1 h-[2px] bg-red-600 max-w-[40px]" />
            </div>

            <div className="space-y-7">
              {/* Location */}
              <div className="flex gap-4 items-start pb-7 border-b border-zinc-300">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-black text-zinc-900 mb-1">Location</p>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    School of Media Studies and Humanities (SMeH)
                    <br />
                    Manav Rachna Campus, Faridabad,
                    <br />
                    Haryana, India – 121004
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4 items-start pb-7 border-b border-zinc-300">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-black text-zinc-900 mb-1">Email</p>
                  <a
                    href="mailto:manavrachnatimes@mriu.edu.in"
                    className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                  >
                    manavrachnatimes@mriu.edu.in
                  </a>
                </div>
              </div>

              {/* Office Hours */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-black text-zinc-900 mb-1">Office Hours</p>
                  <p className="text-sm text-zinc-600">
                    Monday – Friday: 9:00 AM – 5:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Find Us Here */}
          <div>
            {/* section label */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-red-600">
                Find Us Here
              </span>
              <div className="flex-1 h-[2px] bg-red-600 max-w-[40px]" />
            </div>

            {/* Campus photo — full width */}
            <div className="relative w-full mb-6">
              <Image
                src="/MRIIRS.webp"
                alt="Manav Rachna Campus"
                width={900}
                height={480}
                className="w-full h-[280px] object-cover grayscale rounded-sm shadow-sm"
              />
            </div>

            {/* tagline below the image */}
            <div className="flex flex-col">
              <h2 className="text-2xl font-black text-zinc-900 leading-snug mb-3">
                Rooted on Campus.{" "}
                <span className="text-red-600">Reaching Beyond.</span>
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                Manav Rachna Times is a student-run platform telling
                stories that matter — on campus and beyond.
              </p>
              <div className="w-10 h-[2px] bg-red-600" />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
