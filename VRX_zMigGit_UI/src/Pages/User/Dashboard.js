import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { TbArrowsTransferUp } from "react-icons/tb";
import { VscSymbolMisc } from "react-icons/vsc";
import { HiMenu } from "react-icons/hi";
import { TiArrowRightThick } from "react-icons/ti";
import { FaUserCircle } from "react-icons/fa";


import Mapping from "../components/Mapping";
import Transform from "../components/Transform";
import ValidateSection from "../components/Validate";

function Dashboard() {
    const navigate = useNavigate();
    const [selectedSection, setSelectedSection] = useState("welcome");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [transformOutput, setTransformOutput] = useState('');
    { selectedSection === "transform" && <Transform setLoading={setLoading} /> }


    const navItems = [
        { key: "mapping", label: "Mapping", icon: <VscSymbolMisc /> },
        { key: "transform", label: "Transform", icon: <TbArrowsTransferUp /> },
        { key: "validate", label: "Validate & Report", icon: <FaCheckCircle /> },
    ];
    const [username, setUsername] = useState("");
    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col font-[Poppins]">
            {/* Header */}
            <header className="bg-[#840227] text-white px-6 py-4 shadow-md relative">
                <h1 className="text-3xl md:text-5xl font-bold text-center">
                    VRX zMigGIT
                </h1>
                <nav className="absolute top-6 right-6 flex gap-1 items-center">
                    <FaUserCircle className="text-2xl" />
                    <a className="mr-3">{username}</a>
                    <ul className="text-sm md:text-base font-semibold">
                        <li
                            className="hover:text-[#67c02b] cursor-pointer"
                            onClick={() => navigate("/logout")}
                        >
                            Logout
                        </li>
                    </ul>
                </nav>
            </header>

            {/* Mobile Menu Icon */}
            <div className="md:hidden cursor-pointer px-6 py-4" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <HiMenu className="text-2xl" />
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar for Desktop */}
                <aside className="m-10 hidden md:flex flex-col items-start justify-center gap-6 flex-2">
                    {navItems.map((item, index) => (
                        <div key={index} className="flex items-center w-64">
                            <button
                                onClick={() => setSelectedSection(item.key)}
                                className={`w-full flex items-center gap-3 px-4 py-3 bg-[#262626] hover:bg-[#555] rounded-lg text-white ${selectedSection === item.key ? "font-semibold" : ""
                                    }`}
                            >
                                {item.icon} {item.label}
                            </button>
                            {selectedSection === item.key && (
                                <TiArrowRightThick className="text-green-500 text-5xl" />
                            )}
                        </div>
                    ))}
                </aside>


                {/* Sidebar for Mobile */}
                {mobileMenuOpen && (
                    <aside className="fixed z-50 top-20 left-4 right-4 bg-[#262626] text-white rounded-xl shadow-lg p-4 md:hidden">
                        <div className="flex flex-col gap-2">
                            {navItems.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setSelectedSection(item.key);
                                        setMobileMenuOpen(false);
                                    }}
                                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-[#555] rounded-lg text-sm"
                                >
                                    <span className="flex items-center gap-3">
                                        {item.icon} {item.label}
                                    </span>
                                    {selectedSection === item.key && (
                                        <TiArrowRightThick className="text-white ml-2" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </aside>
                )}

                {/* Main Section */}
                <main className="flex-1 bg-white p-6 overflow-y-auto shadow-lg rounded-md mt-10 mb-10 mr-10">
                    <div className="w-full h-full flex items-center justify-center">
                        {selectedSection === "welcome" && (
                            <div className="text-center">
                                <h2 className="text-2xl sm:text-3xl font-semibold text-[#3f3f3f]">
                                    Welcome to zMigGIT
                                </h2>
                                <p className="mt-2 text-sm sm:text-base text-gray-600">
                                    Please select an action to get started.
                                </p>
                            </div>
                        )}
                        {selectedSection === "mapping" && <Mapping />}
                        {selectedSection === "transform" && <Transform
                            setLoading={setLoading}
                            setSuccess={setSuccess}
                            setTransformOutput={setTransformOutput}
                        />}
                        {selectedSection === "validate" && <ValidateSection />}
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="bg-[#840227] text-white px-6 py-4 text-center text-sm sm:text-base">
                © 2025 VRX zMigGIT. All rights reserved.
            </footer>
        </div>
    );
}

export default Dashboard;
