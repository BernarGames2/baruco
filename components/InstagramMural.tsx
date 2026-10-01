"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";

/**
 * Embeds oficiais do Instagram, carregados só com clique (conteúdo de terceiros / LGPD).
 * Só aparece quando `site.instagram.embedPosts` tiver URLs autorizadas.
 */
export function InstagramEmbeds() {
  const [load, setLoad] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const posts = site.instagram.embedPosts;

  useEffect(() => {
    if (!load) return;
    const w = window as Window & { instgrm?: { Embeds: { process: () => void } } };
    if (w.instgrm) {
      w.instgrm.Embeds.process();
      return;
    }
    const s = document.createElement("script");
    s.src = "https://www.instagram.com/embed.js";
    s.async = true;
    document.body.appendChild(s);
  }, [load]);

  if (!posts.length) return null;
  if (!load) {
    return (
      <div className="ig-facade">
        <p>As publicações vêm direto do Instagram (conteúdo de terceiros, pode usar cookies).</p>
        <button type="button" className="mag mag-ghost mag-md" onClick={() => setLoad(true)}>
          <span className="mag-label">Carregar publicações do Instagram</span>
        </button>
      </div>
    );
  }
  return (
    <div ref={ref} className="ig-grid">
      {posts.map((url) => (
        <blockquote key={url} className="instagram-media" data-instgrm-permalink={url} data-instgrm-version="14">
          <a href={url} target="_blank" rel="noopener noreferrer">
            Ver publicação no Instagram
          </a>
        </blockquote>
      ))}
    </div>
  );
}
