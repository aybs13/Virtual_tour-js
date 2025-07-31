"use client";
import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Loader from "../components/Loader";
import { useRouter } from "next/router";

interface Tradisi {
  id_tradisi: number;
  nama_tradisi: string;
  deskripsi: string;
  gambar: string;
  panorama: string;
  posisi_x: number;
  posisi_y: number;
  posisi_z: number;
}

interface Panorama {
  id_panorama: number;
  nama_lokasi: string;
  gambar: string;
  deskripsi: string;
}

export default function Tour() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const viewerRef = useRef<any>(null);
  const panoramaObjectsRef = useRef<{ [key: string]: any }>({});
  const popupRefs = useRef<HTMLElement[]>([]);

  // Utility untuk hapus semua popup
  const removeAllPopups = () => {
    popupRefs.current.forEach((popup) => popup.remove());
    popupRefs.current = [];
  };

  useEffect(() => {
    let isMounted = true;

    const loadPanorama = async () => {
      try {
        const THREE = await import("three");
        const PANOLENS = await import("panolens");

        const container = document.getElementById("panorama") as HTMLElement;
        if (!container) return;

        const [panoramaRes, tradisiRes] = await Promise.all([
          fetch("/api/panorama"),
          fetch("/api/tradisi"),
        ]);

        if (!panoramaRes.ok || !tradisiRes.ok) {
          setError("Gagal memuat data panorama atau tradisi.");
          setLoading(false);
          return;
        }

        const panoramas: Panorama[] = await panoramaRes.json();
        const tradisiList: Tradisi[] = await tradisiRes.json();

        if (!isMounted) return;

        const viewer = new PANOLENS.Viewer({
          container,
          autoRotate: true,
          autoRotateSpeed: 0.5,
          controlBar: true,
          cameraFov: 70,
        });
        viewerRef.current = viewer;

        // Fungsi menambahkan infospot
        const addInfospots = (panoKey: string) => {
          const panorama = panoramaObjectsRef.current[panoKey];
          const tradisiForPano = tradisiList.filter((t) => t.panorama === panoKey);
          console.log("addInfospots:", { panoKey, tradisiForPano });
          if (panorama.userData.infospotAdded) return;

          tradisiForPano.forEach((t) => {
            const spot = new PANOLENS.Infospot(800, "/images/info.png");
            spot.position.set(t.posisi_x, t.posisi_y, t.posisi_z);
            spot.addHoverText(t.nama_tradisi, 80);
            spot.addEventListener("click", () => {
              removeAllPopups();
              const popup = document.createElement("div");
              popup.className = "popup-tradisi";
              popup.innerHTML = `
                <h3 class="popup-title">${t.nama_tradisi}</h3>
                <img src="/images/${t.gambar}" class="popup-img" />
                <p>${t.deskripsi}</p>
                <button class="popup-close">Tutup</button>
              `;
              document.body.appendChild(popup);
              popupRefs.current.push(popup);

              popup.querySelector(".popup-close")?.addEventListener("click", () => {
                popup.remove();
                popupRefs.current = popupRefs.current.filter((p) => p !== popup);
              });
            });

            panorama.add(spot);
          });

          panorama.userData.infospotAdded = true;
        };

        // Load panorama pertama
        const firstPanorama = new PANOLENS.ImagePanorama(`/images/${panoramas[0].gambar}`);
        panoramaObjectsRef.current[panoramas[0].gambar] = firstPanorama;

        viewer.add(firstPanorama);
        addInfospots(panoramas[0].gambar);
        setLoading(false);


        viewer.add(firstPanorama);

        // Lazy load panorama lainnya
        panoramas.slice(1).forEach((p) => {
          const pano = new PANOLENS.ImagePanorama(`/images/${p.gambar}`);
          panoramaObjectsRef.current[p.gambar] = pano;

          pano.addEventListener("enter", () => {
            addInfospots(p.gambar);
          });

          viewer.add(pano);
        });

        // Link antar panorama (looping)
        for (let i = 0; i < panoramas.length; i++) {
          const current = panoramaObjectsRef.current[panoramas[i].gambar];
          const next = panoramaObjectsRef.current[panoramas[(i + 1) % panoramas.length].gambar];
          // Anda bisa atur posisi link sesuai kebutuhan
          current.link(next, new THREE.Vector3(3000, 0, 500));
        }

        // Pop-up Testimoni di panorama terakhir
        panoramaObjectsRef.current[panoramas[panoramas.length - 1].gambar].addEventListener("enter", () => {
          removeAllPopups();
          if (!document.querySelector(".popup-testimoni")) {
            const popup = document.createElement("div");
            popup.className = "popup-testimoni";
            popup.innerHTML = `
              <h3 class="popup-title">Terima Kasih!</h3>
              <p>Bagikan pengalamanmu lewat testimoni.</p>
              <button class="popup-testimoni-go">Isi Testimoni</button>
              <button class="popup-testimoni-close">Nanti Saja</button>
            `;
            document.body.appendChild(popup);
            popupRefs.current.push(popup);

            popup.querySelector(".popup-testimoni-go")?.addEventListener("click", () => {
              popup.remove();
              popupRefs.current = popupRefs.current.filter((p) => p !== popup);
              router.push("/testimoni");
            });
            popup.querySelector(".popup-testimoni-close")?.addEventListener("click", () => {
              popup.remove();
              popupRefs.current = popupRefs.current.filter((p) => p !== popup);
            });
          }
        });

        setTimeout(() => {
          window.dispatchEvent(new Event("resize"));
          viewer.update();
        }, 500);
      } catch (err) {
        setError("Terjadi kesalahan saat memuat panorama: " + (err instanceof Error ? err.message : JSON.stringify(err)));
        setLoading(false);

        console.error("PANORAMA ERROR", err);
      }
    };

    loadPanorama();

    return () => {
      isMounted = false;
      // Cleanup viewer
      if (viewerRef.current) {
        viewerRef.current.dispose();
        viewerRef.current = null;
      }
      // Cleanup popup
      removeAllPopups();
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      {loading && <Loader />}
      {error && (
        <div className="fixed top-0 left-0 w-full bg-red-500 text-white text-center py-2 z-[99999]">
          {error}
        </div>
      )}
      <div id="panorama" className="h-screen w-full" />
<style jsx global>{`
  .popup-tradisi, .popup-testimoni {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    color: black;
    padding: 20px 15px;
    border-radius: 12px;
    width: 320px;
    z-index: 9999;
    font-size: 14px;
    box-shadow: 0 0 25px rgba(168,85,247,0.7);
    text-align: center;
  }

  /* 🌙 Dark mode support */
  .dark .popup-tradisi,
  .dark .popup-testimoni {
    background: #1f2937; /* dark gray */
    color: #f9fafb;       /* text-white */
  }

  .popup-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .popup-img {
    width: 100%;
    margin: 10px 0;
    border-radius: 8px;
  }

  .popup-close,
  .popup-testimoni-go,
  .popup-testimoni-close {
    margin-top: 10px;
    margin-right: 8px;
    padding: 6px 16px;
    border: none;
    border-radius: 6px;
    background: #a855f7;
    color: white;
    cursor: pointer;
  }

  .popup-testimoni-close {
    background: #aaa;
  }

  .dark .popup-testimoni-close {
    background: #4b5563; /* dark gray in dark mode */
  }
`}</style>
    </div>
  );
}
