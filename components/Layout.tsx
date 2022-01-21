import Logo from "../components/Logo";

export default function Layout({children}) {

    return (
        <div className="relative w-full h-screen">
            <header className="fixed top-0 left-0 z-10 flex flex-wrap items-center justify-center w-full h-24 bg-white shadow-lg">
                <Logo />
            </header>
            <main className="z-0 inline-block w-full px-6 py-4 pt-24 mt-7 md:mt-10 lg:px-10 xl:px-14">
                {children}
            </main>
        </div>
    )
}
