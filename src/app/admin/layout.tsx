"use client";

import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import FullScreenLoading from "@/components/shared/Loading/FullScreenLoading";

import BannerDataForm from "@/components/(admin)/admin/BannerDataForm";
import ContactInfoForm from "@/components/(admin)/admin/ContactInfoForm";
import SocialLinksForm from "@/components/(admin)/admin/SocialLinksForm";
import TeamDataForm from "@/components/(admin)/admin/TeamDataForm";
import ProjectDataForm from "@/components/(admin)/admin/ProjectDataForm";
import NewsDataForm from "@/components/(admin)/admin/NewsDataForm";
import JournalDataForm from "@/components/(admin)/admin/JournalDataForm";
import ConferenceDataForm from "@/components/(admin)/admin/ConferenceDataForm";
import ResearchDataForm from "@/components/(admin)/admin/ResearchDataForm";

interface AdminLayoutProps {
    children?: React.ReactNode;
}

// Define your admin tabs along with their corresponding component.
const adminTabs = [
    { label: "Banner", key: "banner", component: <BannerDataForm /> },
    { label: "Contact Info", key: "contact", component: <ContactInfoForm /> },
    { label: "Social Links", key: "social", component: <SocialLinksForm /> },
    { label: "Team", key: "team", component: <TeamDataForm /> },
    { label: "Projects", key: "projects", component: <ProjectDataForm /> },
    { label: "News", key: "news", component: <NewsDataForm /> },
    { label: "Journals", key: "journals", component: <JournalDataForm /> },
    { label: "Conferences", key: "conferences", component: <ConferenceDataForm /> },
    { label: "Research", key: "research", component: <ResearchDataForm /> },
];

const AdminLayout: React.FC<AdminLayoutProps> = () => {
    const { data: session, status } = useSession();
    const [currentTab, setCurrentTab] = useState("banner");

    // Redirect to /login if not authenticated.
    useEffect(() => {
        if (!session && status !== "loading") {
            // Use router.push("/login") if needed. Here we simply return null.
        }
    }, [session, status]);

    if (status === "loading") {
        return <FullScreenLoading />;
    }
    if (!session) {
        return null;
    }

    // Find the active tab component.
    const activeTab = adminTabs.find((tab) => tab.key === currentTab);

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md border-r border-gray-200">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-primary">Admin Dashboard</h2>
                </div>
                <nav className="mt-6">
                    <ul>
                        {adminTabs.map((tab) => (
                            <li
                                key={tab.key}
                                className={`px-6 py-2 cursor-pointer hover:bg-sky-200 ${currentTab === tab.key ? "font-bold text-primary" : "text-gray-700"
                                    }`}
                                onClick={() => setCurrentTab(tab.key)}
                            >
                                {tab.label}
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {/* Top header */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-primary">
                            {activeTab ? activeTab.label : "Dashboard"}
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700">
                            {session.user?.name ? `Hello, ${session.user.name}` : "Admin"}
                        </span>
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition"
                        >
                            Sign Out
                        </button>
                    </div>
                </header>

                {/* Tab content area with animation */}
                <motion.div
                    key={currentTab} // Ensure animation when switching tabs
                    className="bg-white rounded-md shadow p-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab && activeTab.component}
                </motion.div>
            </main>
        </div>
    );
};

export default AdminLayout;
