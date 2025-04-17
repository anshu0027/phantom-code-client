import { LuVideo } from "react-icons/lu";

function VideoView() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center p-4">
            <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-[#2A2A3A] p-4">
                    <LuVideo size={32} className="text-[#CBA6F7]" />
                </div>
                <h2 className="text-xl font-semibold text-[#CDD6F4]">Video Meeting</h2>
                <p className="text-center text-sm text-[#A6ADC8]">
                    Start a video meeting with your team members
                </p>
                <a
                    href="https://aqua-meet-anshu.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 rounded-lg bg-[#CBA6F7] px-6 py-2 text-sm font-medium text-[#1E1E2E] transition-all duration-200 hover:bg-[#CBA6F7]/80"
                >
                    Start Meeting
                </a>
            </div>
        </div>
    )
}

export default VideoView 