import ContactForm from "@/components/ContactForm";

export const metadata = { title: "About — Bay Area Improv" };

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-12">About</h1>

      <div className="prose-sm text-[#44403c] leading-relaxed space-y-4 mb-16">
        <p>
          This site is run by Kia Salehi and Dylan Ray. The improv community in the Bay Area is
          made up of so many different organizations, and while they each have their own website
          or social media presence, we wanted to create a place where all these overlapping
          circles come together.
        </p>
        <p>
          Our aim is to provide newcomers to the scene a jumping off point for getting involved,
          and existing community members a central hub of information and publicity.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-[#1c1917] tracking-tight mb-6">Get in touch</h2>
      <ContactForm />
    </main>
  );
}
