"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import FullScreenLoading from "@/components/shared/Loading/FullScreenLoading";

interface AdminLayoutProps {
    children: React.ReactNode;
}

const adminRoutes = [
    { label: "Banner", route: "/admin/banner" },
    { label: "About", route: "/admin/about" },
    { label: "Blog", route: "/admin/blog" },
    { label: "Contact", route: "/admin/contact" },
    { label: "Data Collection and Analysis", route: "/admin/data-collection-and-analysis" },
    { label: "Education", route: "/admin/education" },
    { label: "Project", route: "/admin/project" },
    { label: "Publication", route: "/admin/publication" },
    { label: "Reference", route: "/admin/reference" },
    { label: "Research Experience", route: "/admin/research-experience" },
    { label: "Technical Skill", route: "/admin/technical-skill" },
];

// Animation variants
const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.5 } },
};

const mainVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.5, duration: 0.8 } },
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const router = useRouter();

    // Redirect to /login if not authenticated.
    useEffect(() => {
        if (!session && status !== "loading") {
            router.push("/login");
        }
    }, [session, status, router]);

    // Redirect from /admin to /admin/banner if no specific route is provided.
    useEffect(() => {
        if (pathname === "/admin") {
            router.push("/admin/banner");
        }
    }, [pathname, router]);

    if (status === "loading") {
        return <FullScreenLoading />;
    }
    // Once redirected, this component will unmount so no need to show unauthorized message.
    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen mt-24 bg-gray-50">
            {/* Primary Header */}
            <motion.header
                variants={headerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white shadow-md border-b border-gray-200"
            >
                <div className="w-full mx-auto px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
                    <button
                        onClick={() => signOut()}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>
            </motion.header>

            {/* Secondary Navbar */}
            <motion.nav
                variants={navbarVariants}
                initial="hidden"
                animate="visible"
                className="bg-gray-100 shadow-inner border-b border-gray-200"
            >
                <div className="w-full mx-auto px-6 py-3 flex space-x-4 overflow-x-auto">
                    {adminRoutes.map((item) => {
                        const isActive = pathname === item.route;
                        return (
                            <Link
                                key={item.route}
                                href={item.route}
                                className={`px-4 py-2 rounded-md whitespace-nowrap transition ${isActive
                                    ? "bg-primary text-white shadow"
                                    : "bg-white text-gray-700 hover:bg-primary"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </motion.nav>

            {/* Main Content Area */}
            <motion.main
                variants={mainVariants}
                initial="hidden"
                animate="visible"
                className="w-full mx-auto px-6 py-8"
            >
                {children}
            </motion.main>
        </div>
    );
};

export default AdminLayout;
