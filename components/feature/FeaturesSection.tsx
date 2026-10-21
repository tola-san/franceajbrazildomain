import { SlGlobe } from "react-icons/sl";
import { PiSealCheckBold } from "react-icons/pi";
import { LuBoxes } from "react-icons/lu";
import { GoCodeOfConduct } from "react-icons/go";
import { useTranslations } from "next-intl";
import Image from "next/image";


export default function FeatureHighlights() {
    const t = useTranslations('highlight');
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full mt-2 lg:mt-5">
            <div className="relative bg-[#EFE9E5] rounded-[30px] lg:rounded-[50px] min-h-[220px] flex flex-col justify-between p-10">
                <div className="relative bg-primary rounded-lg w-10 h-10  flex items-center justify-center">
                    <SlGlobe size={20} className="text-white" />
                </div>
                <div className="space-y-2 mt-10">
                    <h3 className="text-lg 2xl:text-2xl font-normal text-primary">Global Reach, Local Expertise</h3>
                    <p className="text-base font-medium">With deep roots in Brazil and over 30 years in international trade, we combine local sourcing strength with global logistics know-how to deliver smooth, reliable cross-border shipments.</p>
                </div>
            </div>
            <div className="relative bg-[#EFE9E5] rounded-[30px] lg:rounded-[50px] min-h-[220px] flex flex-col justify-between p-10">
                <div className="relative bg-primary rounded-lg w-10 h-10  flex items-center justify-center">
                    <PiSealCheckBold size={22} className="text-white" />
                </div>
                <div className="space-y-2 mt-10">
                    <h3 className="text-lg 2xl:text-2xl font-normal text-primary">Trusted Partnerships That Last</h3>
                    <p className="text-base font-medium">We build long-term relationships through integrity and transparency. From your first inquiry to final delivery, our team is committed to clear communication and personalized support.</p>
                </div>
            </div>
            <div className="relative bg-[#EFE9E5] rounded-[30px] lg:rounded-[50px] min-h-[220px] flex flex-col justify-between p-10">
                <div className="relative bg-primary rounded-lg w-10 h-10  flex items-center justify-center">
                    <LuBoxes size={22} className="text-white" />
                </div>
                <div className="space-y-2 mt-10">
                    <h3 className="text-lg 2xl:text-2xl font-normal text-primary">Uncompromising Product Quality</h3>
                    <p className="text-base font-medium">Our dedicated quality assurance team enforces strict control measures at every step — from supplier selection to final export — ensuring every product meets international food safety standards.</p>
                </div>
            </div>
            <div className="relative bg-[#EFE9E5] rounded-[30px] lg:rounded-[50px] min-h-[220px] flex flex-col justify-between p-10">
                <div className="relative bg-primary rounded-lg w-10 h-10  flex items-center justify-center">
                    <GoCodeOfConduct size={22} className="text-white" />
                </div>
                <div className="space-y-2 mt-10">
                    <h3 className="text-lg 2xl:text-2xl font-normal text-primary">Customized & Competitive Solutions</h3>
                    <p className="text-base font-medium">We offer flexible volume options and competitive pricing tailored to your market needs, helping you stay ahead in a dynamic global food industry.</p>
                </div>
            </div>
        </div>

    )
}