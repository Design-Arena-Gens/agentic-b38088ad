"use client";

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

type Scene = {
  id: number;
  start: number; // seconds inclusive
  end: number;   // seconds exclusive
  text: string;
  kicker?: string;
  bg: { type: 'image' | 'gradient'; src?: string };
};

const TOTAL_DURATION = 17; // seconds

const SCENES: Scene[] = [
  {
    id: 1,
    start: 0,
    end: 2,
    kicker: 'SCENE 1 ? HOOK',
    text: 'Every journey is different?',
    bg: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1600&auto=format&fit=crop', // hospital
    },
  },
  {
    id: 2,
    start: 2,
    end: 4,
    kicker: 'SCENE 2 ? SETUP',
    text: 'But some journeys test every bit of your strength.',
    bg: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1600359755266-0122b3c33836?q=80&w=1600&auto=format&fit=crop', // mother & newborn
    },
  },
  {
    id: 3,
    start: 4,
    end: 7,
    kicker: 'SCENE 3 ? EMOTION',
    text: 'Sleepless nights. Fear. Prayers.',
    bg: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop', // eyes/close-up mood
    },
  },
  {
    id: 4,
    start: 7,
    end: 9,
    kicker: 'SCENE 4 ? RISING',
    text: 'Yet? they never gave up.',
    bg: { type: 'gradient' },
  },
  {
    id: 5,
    start: 9,
    end: 12,
    kicker: 'SCENE 5 ? CLIMAX',
    text: 'Because this little life is their whole world.',
    bg: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1576765974027-c9ae0b9e09b0?q=80&w=1600&auto=format&fit=crop', // baby wrapped
    },
  },
  {
    id: 6,
    start: 12,
    end: 15,
    kicker: 'SCENE 6 ? RESOLUTION',
    text: 'Strong parents raise strong miracles.',
    bg: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1543176473-7649b4d1b05a?q=80&w=1600&auto=format&fit=crop', // family
    },
  },
  {
    id: 7,
    start: 15,
    end: 17,
    kicker: 'CTA ? OPTIONAL',
    text: 'Share your miracle story. ??',
    bg: { type: 'gradient' },
  },
];

function useTimeline() {
  const [seconds, setSeconds] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startMsRef = useRef<number | null>(null);
  const pausedRef = useRef(false);

  const start = () => {
    pausedRef.current = false;
    startMsRef.current = performance.now() - seconds * 1000;
    const loop = () => {
      if (pausedRef.current) return;
      const now = performance.now();
      const startMs = startMsRef.current ?? now;
      const elapsed = Math.min(TOTAL_DURATION * 1000, now - startMs);
      setSeconds(Math.floor(elapsed) / 1000);
      if (elapsed < TOTAL_DURATION * 1000) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  const pause = () => {
    pausedRef.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  const restart = () => {
    setSeconds(0);
    startMsRef.current = performance.now();
    pausedRef.current = false;
    const loop = () => {
      if (pausedRef.current) return;
      const now = performance.now();
      const elapsed = Math.min(TOTAL_DURATION * 1000, now - (startMsRef.current ?? now));
      setSeconds(Math.floor(elapsed) / 1000);
      if (elapsed < TOTAL_DURATION * 1000) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    start();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { seconds, start, pause, restart };
}

export default function Page() {
  const { seconds, restart } = useTimeline();
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSceneIndex = useMemo(() => {
    return SCENES.findIndex((s) => seconds >= s.start && seconds < s.end);
  }, [seconds]);

  const progressPerScene = useMemo(() => {
    return SCENES.map((s) => {
      if (seconds <= s.start) return 0;
      if (seconds >= s.end) return 100;
      const span = s.end - s.start;
      const into = seconds - s.start;
      return Math.max(0, Math.min(100, (into / span) * 100));
    });
  }, [seconds]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (soundEnabled) {
      audioRef.current.muted = false;
      audioRef.current.volume = 0.7;
      const play = async () => {
        try { await audioRef.current?.play(); } catch { /* ignore */ }
      };
      play();
    } else {
      audioRef.current.muted = true;
    }
  }, [soundEnabled]);

  const ended = seconds >= TOTAL_DURATION;

  return (
    <div className="phone-frame" role="region" aria-label="Emotional story reel">
      <div className="progress" aria-hidden>
        {SCENES.map((_, i) => (
          <div className="bar" key={i}>
            <span style={{ ['--w' as any]: `${progressPerScene[i]}%` }} />
          </div>
        ))}
      </div>

      <div className="badge">00:{String(Math.floor(seconds)).padStart(2, '0')} / 00:{TOTAL_DURATION}
      </div>

      {SCENES.map((scene, idx) => {
        const active = idx === currentSceneIndex;
        const isImage = scene.bg.type === 'image';
        return (
          <div
            key={scene.id}
            className="scene"
            aria-hidden={!active}
            style={{
              opacity: active ? 1 : 0,
              transition: 'opacity 450ms ease',
            }}
          >
            <div className="bg-cover">
              {isImage && scene.bg.src ? (
                <Image
                  src={scene.bg.src}
                  alt={scene.kicker ?? 'scene'}
                  className="bg-img soft-pan"
                  fill
                  priority={idx <= 1}
                  sizes="(max-width: 420px) 100vw, 420px"
                />
              ) : (
                <div
                  className="bg-img"
                  style={{
                    background:
                      'radial-gradient(120% 120% at 50% 0%, #1f2a44 0%, #0b0b0b 70%), linear-gradient(135deg, #151515, #0b0b0b)',
                  }}
                />
              )}
              <div className="bg-overlay" />
            </div>

            <div className="scene-text">
              {scene.kicker && <div className="kicker">{scene.kicker}</div>}
              <div className="headline">{scene.text}</div>
            </div>
          </div>
        );
      })}

      {!soundEnabled && (
        <button className="tap-audio control-btn" onClick={() => setSoundEnabled(true)}>
          Tap for sound
        </button>
      )}

      <div className="controls">
        {ended ? (
          <button className="control-btn" onClick={() => { setSoundEnabled(false); restart(); }}>
            Replay
          </button>
        ) : (
          <button className="control-btn" onClick={() => setSoundEnabled((s) => !s)}>
            {soundEnabled ? 'Mute' : 'Unmute'}
          </button>
        )}
      </div>

      <div className="bottom-cta">
        <a className="cta-btn" href="#share" onClick={(e) => e.preventDefault()}>
          Share your miracle story
        </a>
      </div>

      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/download/audio/2022/10/09/audio_98d148d98ef5.mp3?filename=lullaby-121695.mp3"
        preload="auto"
        loop
        muted
      />
    </div>
  );
}
