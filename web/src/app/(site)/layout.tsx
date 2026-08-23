import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsappButton from "@/components/WhatsappButton";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsappButton />
    </>
  );
}
