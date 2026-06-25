"use client";

import { useEffect, useRef, useState } from "react";

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
type PermissionState = "idle" | "requesting" | "ready" | "unavailable";

export default function StatusBar() {
  const [status, setStatus] = useState<Status | null>(null);
  const [permission, setPermission] = useState<PermissionState>("idle");
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  async function resolve(lat: number, lon: number, controller: AbortController) {
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
    setPermission("ready");
  }

  async function ipFallback(controller: AbortController) {
    try {
      const geo = await fetch("https://ipapi.co/json/", {
        signal: controller.signal,
      }).then((r) => r.json());
      if (geo?.latitude != null && geo?.longitude != null) {
        await resolve(geo.latitude, geo.longitude, controller);
        return;
      }
      setPermission("unavailable");
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") setPermission("unavailable");
    }
  }

  function onRequestLocation() {
    const controller = new AbortController();
    controllerRef.current?.abort();
    controllerRef.current = controller;
    setPermission("requesting");

    const fallbackToCoarseLocation = () => {
      ipFallback(controller).catch(() => setPermission("unavailable"));
    };
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve(
            pos.coords.latitude,
            pos.coords.longitude,
            controller,
          ).catch(fallbackToCoarseLocation),
        fallbackToCoarseLocation,
        { timeout: 8000, maximumAge: 600000 },
      );
    } else {
      fallbackToCoarseLocation();
    }
  }

  if (!status) {
    return (
      <button
        type="button"
        aria-label="开启位置天气"
        onClick={onRequestLocation}
        className="group inline-flex max-w-full items-center gap-2 rounded-full border border-hairline bg-paper-dim/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-label text-ink-soft shadow-[0_10px_30px_-28px_rgba(28,25,22,0.35)] transition-colors duration-300 hover:border-accent hover:bg-paper sm:text-[11px]"
      >
        <span
          aria-hidden
          className="grid h-5 w-5 place-items-center rounded-full bg-paper text-[12px] leading-none text-accent transition-colors group-hover:bg-accent group-hover:text-paper"
          style={{
            fontFamily:
              '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif',
          }}
        >
          📍
        </span>
        <span className="text-ink">
          {permission === "requesting" ? "定位中" : "开启天气"}
        </span>
        <span className="hidden h-3 w-px bg-hairline sm:block" />
        <span className="hidden sm:inline">
          {permission === "unavailable" ? "稍后再试" : "城市状态"}
        </span>
      </button>
    );
  }

  return (
    <span className="inline-flex max-w-full animate-fade-up items-center gap-2 rounded-full border border-hairline bg-paper-dim/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-label text-ink-soft shadow-[0_10px_30px_-28px_rgba(28,25,22,0.35)] sm:shrink-0 sm:text-[11px]">
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
      <span className="min-w-0 truncate text-ink">{status.city}</span>
      <span className="h-3 w-px bg-hairline" />
      <span>{status.temp}°C</span>
      <span className="h-3 w-px bg-hairline" />
      <span>{status.label}</span>
    </span>
  );
}
