"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Loader from "../components/Loader";
import * as THREE from "three";
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
  const router = useRouter();

  useEffect(() => {
    let viewer: any;
    let panoramaObjects: { [key: string]: any } = {};

    const loadPanorama = async () => {
      const PANOLENS = await import("panolens");
      const container = document.getElementById("panorama") as HTMLElement;

      while (container.firstChild) container.removeChild(container.firstChild);

      const panoramaRes = await fetch("/api/panorama");
      const panoramas: Panorama[] = await panoramaRes.json();

      const tradisiRes = await fetch("/api/tradisi");
      const tradisiList: Tradisi[] = await tradisiRes.json();

      panoramas.forEach((pano) => {
        panoramaObjects[pano.gambar] = new PANOLENS.ImagePanorama(
          `/images/${pano.gambar}`
        );
      });

      viewer = new PANOLENS.Viewer({
        container,
        autoRotate: true,
        autoRotateSpeed: 0.5,
        controlBar: true,
        cameraFov: 70,
      });
      viewer.renderer.setPixelRatio(window.devicePixelRatio);

      Object.values(panoramaObjects).forEach((pano) => viewer.add(pano));

      panoramaObjects[panoramas[0].gambar].addEventListener(
        "progress",
        (e: any) => {
          const progress = (e.progress.loaded / e.progress.total) * 100;
          if (progress > 30 && loading) {
            setTimeout(() => setLoading(false), 300);
          }
        }
      );

      // ✅ Fungsi untuk menambahkan infospot ke panorama tertentu
      const addInfospots = (panoKey: string) => {
        const panorama = panoramaObjects[panoKey];

        // ✅ Cegah duplikasi: jika sudah ditambahkan, langsung return
        if (panorama.userData.infospotAdded) return;

        tradisiList
          .filter((t) => t.panorama === panoKey)
          .forEach((tradisi) => {
            const infoSpot = new PANOLENS.Infospot(800, "/images/info.png");
            infoSpot.position.set(
              tradisi.posisi_x,
              tradisi.posisi_y,
              tradisi.posisi_z
            );

            // ✅ Pastikan tidak menambahkan hover text double
            if (
              !infoSpot.element ||
              infoSpot.element.innerText !== tradisi.nama_tradisi
            ) {
              infoSpot.addHoverText(tradisi.nama_tradisi, 80);
            }

            infoSpot.addEventListener("click", () => {
              document
                .querySelectorAll(".popup-tradisi")
                .forEach((el) => el.remove());

              const popup = document.createElement("div");
              popup.className = "popup-tradisi";
              popup.style.position = "fixed";
              popup.style.top = "50%";
              popup.style.left = "50%";
              popup.style.transform = "translate(-50%, -50%)";
              popup.style.background = "rgba(255,255,255,0.97)";
              popup.style.padding = "15px";
              popup.style.borderRadius = "12px";
              popup.style.width = "300px";
              popup.style.zIndex = "9999";
              popup.style.boxShadow = "0 0 20px rgba(168,85,247,0.7)";
              popup.style.fontSize = "14px";
              popup.innerHTML = `
                <h3 style="font-size:18px; font-weight:bold; margin-bottom:8px; color:#a855f7">
                  ${tradisi.nama_tradisi}
                </h3>
                <img src="/images/${tradisi.gambar}" style="width:100%; border-radius:8px; margin-bottom:8px"/>
                <p style="color:#444">${tradisi.deskripsi}</p>
                <button style="margin-top:10px; background:#a855f7; color:white; padding:6px 10px; border:none; border-radius:6px; cursor:pointer;">
                  Tutup
                </button>
              `;
              document.body.appendChild(popup);

              popup
                .querySelector("button")
                ?.addEventListener("click", () => popup.remove());
            });

            panorama.add(infoSpot);
          });

        // ✅ Tandai panorama sudah ditambahkan infospot
        panorama.userData.infospotAdded = true;
      };

      // ✅ Tambahkan infospot langsung untuk panorama pertama
      addInfospots(panoramas[0].gambar);

      // ✅ Tambahkan infospot setelah panorama lain dimasuki
      Object.keys(panoramaObjects).forEach((key) => {
        panoramaObjects[key].addEventListener("enter", () => addInfospots(key));
      });

      // ✅ Navigasi antar panorama
      for (let i = 0; i < panoramas.length - 1; i++) {
        const current = panoramaObjects[panoramas[i].gambar];
        const next = panoramaObjects[panoramas[i + 1].gambar];
        current.link(next, new THREE.Vector3(3000, 0, 500));
        next.link(current, new THREE.Vector3(-3000, 0, 500));
      }

      // ✅ Pop-up Testimoni di panorama terakhir
      const lastPanorama =
        panoramaObjects[panoramas[panoramas.length - 1].gambar];
      lastPanorama.addEventListener("enter", () => {
        if (!document.querySelector(".popup-testimoni")) {
          const popup = document.createElement("div");
          popup.className = "popup-testimoni";
          popup.style.position = "fixed";
          popup.style.top = "50%";
          popup.style.left = "50%";
          popup.style.transform = "translate(-50%, -50%)";
          popup.style.background = "rgba(255,255,255,0.97)";
          popup.style.padding = "20px";
          popup.style.borderRadius = "12px";
          popup.style.width = "320px";
          popup.style.zIndex = "9999";
          popup.style.textAlign = "center";
          popup.style.boxShadow = "0 0 25px rgba(168,85,247,0.7)";
          popup.innerHTML = `
            <h3 style="font-size:18px; font-weight:bold; color:#a855f7; margin-bottom:10px">
              Terima Kasih Sudah Menjelajah!
            </h3>
            <p style="color:#444; margin-bottom:12px">
              Bagikan pengalaman Anda melalui testimoni.
            </p>
            <button id="goTestimoni" style="background:#a855f7; color:white; padding:8px 12px; border:none; border-radius:6px; cursor:pointer; margin-right:5px">
              Isi Testimoni
            </button>
            <button id="closeTestimoni" style="background:#ccc; color:black; padding:8px 12px; border:none; border-radius:6px; cursor:pointer;">
              Nanti Saja
            </button>
          `;
          document.body.appendChild(popup);

          document
            .getElementById("goTestimoni")
            ?.addEventListener("click", () => {
              popup.remove();
              router.push("/testimoni");
            });

          document
            .getElementById("closeTestimoni")
            ?.addEventListener("click", () => popup.remove());
        }
      });

      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
        viewer.update();
      }, 800);
    };

    setTimeout(loadPanorama, 500);
    return () => viewer && viewer.dispose();
  }, [loading, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <Navbar />
      {loading && <Loader />}
      <div id="panorama" className="h-screen w-full bg-black"></div>
    </div>
  );
}
