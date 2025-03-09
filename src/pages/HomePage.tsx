import FormComponent from "@/components/forms/FormComponent";

function HomePage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[#2A2A3A]">
            <p className="text-4xl font-extrabold flex items-center gap-2 font-orbitron">
                🧑‍💻 Phantom Code
            </p>
            <div className="flex w-full items-center justify-center sm:w-1/2">
                <FormComponent />
            </div>
        </div>
    );
}

export default HomePage;
