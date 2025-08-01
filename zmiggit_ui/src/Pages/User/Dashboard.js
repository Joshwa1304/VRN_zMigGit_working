import { useNavigate } from "react-router-dom";



function Dashboard() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-[#840227] text-white px-6 py-4 shadow-md relative">
                <h1 className="text-3xl md:text-5xl font-bold font-[Poppins] text-center">
                    VRN zMigGit
                </h1>
                <nav className="absolute top-7 right-6">
                    <ul className="text-sm md:text-base font-semibold">
                        <li className="hover:text-[#67c02b] cursor-pointer" onClick={() => navigate("/logout")}>Logout</li>
                    </ul>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-grow p-4">
                <h1>hello</h1>
            </main>

            {/* Footer */}
            <footer className="bg-[#840227] text-white px-6 py-4 shadow-md text-center">
                © 2025 zMigGIT. All rights reserved.
            </footer>
        </div>
    )
}

export default Dashboard;