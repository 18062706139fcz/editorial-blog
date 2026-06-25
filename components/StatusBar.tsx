"use client";

import { useEffect, useState } from "react";

// Maps Open-Meteo WMO weather codes to a color emoji (VS16-forced) + label.
function describe(code: number): { icon: string; label: string } {
  if (code === 0) return { icon: "☀️", label: "晴" };
  if (code <= 2) return { icon: "⛅️", label: "多云" };
  if (code === 3) return { icon: "☁️", label: "阴" };
  if (code <= 48) return { icon: "🌫️", label: "雾" };
  if (code <= 57) return { icon: "🌦️", label: "小雨" };
  if (code <= 67) return { icon: "🌧️", label: "雨" };
  if (code <= 77) return { icon: "❄️", label: "雪" };
  if (code <= 82) return { icon: "🌧️", label: "阵雨" };
  if (code <= 86) return { icon: "🌨️", label: "阵雪" };
  return { icon: "⛈️", label: "雷雨" };
}

type Status = { city: string; temp: number; icon: string; label: string };

export default function StatusBar() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    // Reverse-geocode + fetch weather for a precise coordinate.
    async function resolve(lat: number, lon: number) {
      const [geo, w] = await Promise.all([
        fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=zh-CN`,
          { signal: controller.signal },
        )
          .then((r) => r.json())
          .catch(() => null),
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`,
          { signal: controller.signal },
        ).then((r) => r.json()),
      ]);
      if (cancelled) return;
      // Prefer the prefecture-level city (e.g. "Hangzhou") over a district.
      const city =
        geo?.city ||
        geo?.locality ||
        geo?.principalSubdivision ||
        "附近";
      const code = w?.current?.weather_code ?? 0;
      const { icon, label } = describe(code);
      setStatus({
        city,
        temp: Math.round(w?.current?.temperature_2m ?? 0),
        icon,
        label,
      });
    }

    // Fallback: coarse IP-based location when geolocation is unavailable/denied.
    async function ipFallback() {
      try {
        const geo = await fetch("https://ipapi.co/json/", {
          signal: controller.signal,
        }).then((r) => r.json());
        if (geo?.latitude != null && geo?.longitude != null) {
          await resolve(geo.latitude, geo.longitude);
        }
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") {
          // Status line is a nicety; stay silent on failure.
        }
      }
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve(pos.coords.latitude, pos.coords.longitude).catch(() => {}),
        () => ipFallback(),
        { timeout: 8000, maximumAge: 600000 },
      );
    } else {
      ipFallback();
    }

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  if (!status) return null;

  return (
    <span className="inline-flex animate-fade-up items-center gap-2 font-mono text-[11px] uppercase tracking-label text-ink-soft">
      <span
        aria-hidden
        className="text-[13px] leading-none"
        style={{
          fontFamily:
            '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif',
        }}
      >
        {status.icon}
      </span>
      <span className="text-ink">{status.city}</span>
      <span className="h-3 w-px bg-hairline" />
      <span>{status.temp}°C</span>
      <span className="h-3 w-px bg-hairline" />
      <span>{status.label}</span>
    </span>
  );
}
