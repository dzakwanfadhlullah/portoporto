"use client";

import { useEffect } from "react";

import { projects } from "@/components/apps/projects/data";
import { preloadAppComponent, useAppRegistry } from "@/stores/useAppRegistry";
import type { AppId } from "@/types/app";
import { preloadImages, runWhenIdle } from "@/lib/performance";

const PRIMARY_APPS: AppId[] = ["projects", "project-detail", "about", "contact", "settings"];
const SECONDARY_APPS: AppId[] = ["lab", "photobooth"];

export const AssetPreloader = () => {
    const getAllApps = useAppRegistry((s) => s.getAllApps);

    useEffect(() => {
        const apps = getAllApps();
        const appImages = apps
            .map((app) => app.iconConfig.image)
            .filter((image): image is string => Boolean(image));
        const projectThumbnails = projects.map((project) => project.thumbnail);
        const projectDetails = projects.flatMap((project) => project.detailImages ?? []);

        preloadImages(["/macos-big.jpg", ...appImages, ...projectThumbnails], "high");

        runWhenIdle(() => {
            PRIMARY_APPS.forEach(preloadAppComponent);
            preloadImages(projectDetails.slice(0, 6), "low");
        });

        runWhenIdle(() => {
            SECONDARY_APPS.forEach(preloadAppComponent);
            preloadImages(projectDetails.slice(6), "low");
        });
    }, [getAllApps]);

    return null;
};
