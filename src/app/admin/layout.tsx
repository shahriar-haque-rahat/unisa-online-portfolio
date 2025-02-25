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
import LogoForm from "@/components/(admin)/admin/LogoForm";

interface AdminLayoutProps {
    children?: React.ReactNode;
}

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
    { label: "Logo", key: "logo", component: <LogoForm /> },
];

const AdminLayout: React.FC<AdminLayoutProps> = () => {
    const { data: session, status } = useSession();
    const [currentTab, setCurrentTab] = useState("banner");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        if (!session && status !== "loading") {
            // redirect if needed
        }
    }, [session, status]);

    if (status === "loading") {
        return <FullScreenLoading />;
    }
    if (!session) {
        return null;
    }

    const activeTab = adminTabs.find((tab) => tab.key === currentTab);

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <header className="flex justify-between items-center p-4 bg-white shadow-md">
                <div className="flex items-center">
                    <button onClick={() => setIsDrawerOpen(true)} className="mr-4 focus:outline-none">
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 className="text-3xl font-bold text-primary">{activeTab ? activeTab.label : "Dashboard"}</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-700">{session.user?.name ? `Hello, ${session.user.name}` : "Admin"}</span>
                    <button onClick={() => signOut({ callbackUrl: "/login" })} className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition">
                        Sign Out
                    </button>
                </div>
            </header>

            <motion.div
                initial={{ x: -300 }}
                animate={{ x: isDrawerOpen ? 0 : -300 }}
                transition={{ duration: 0.3 }}
                className="fixed top-0 left-0 h-full w-64 bg-white shadow-md border-r border-gray-200 z-50"
            >
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
                                onClick={() => {
                                    setCurrentTab(tab.key);
                                    setIsDrawerOpen(false);
                                }}
                            >
                                {tab.label}
                            </li>
                        ))}
                    </ul>
                </nav>
            </motion.div>
            {isDrawerOpen && (
                <div onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 bg-black opacity-50 z-40"></div>
            )}

            <main className="flex-1 mt-4">
                <motion.div
                    key={currentTab}
                    className=""
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
