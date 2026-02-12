import { Logo } from "@/components/layout/Logo";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Frameworks", href: "#" },
    { label: "Demo", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "API", href: "#" },
    { label: "Status", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Security", href: "#" },
  ],
};

const countries = [
  { flag: "🇦🇪", name: "UAE" },
  { flag: "🇸🇦", name: "KSA" },
  { flag: "🇶🇦", name: "Qatar" },
  { flag: "🇧🇭", name: "Bahrain" },
  { flag: "🇰🇼", name: "Kuwait" },
  { flag: "🇴🇲", name: "Oman" },
];

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Logo and description */}
          <div className="col-span-2">
            <Logo variant="white" className="mb-4" />
            <p className="text-sidebar-foreground/70 text-sm leading-relaxed mb-6 max-w-xs">
              AI-powered ESG compliance for GCC SMEs. Get your sustainability report done in hours, not months.
            </p>
            <div className="flex flex-wrap gap-2">
              {countries.map((country) => (
                <span 
                  key={country.name}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-sidebar-accent rounded text-xs"
                >
                  <span>{country.flag}</span>
                  <span>{country.name}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-sidebar-foreground mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href}
                      className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="bg-sidebar-border mb-8" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sidebar-foreground/60 text-sm">
            © {new Date().getFullYear()} AFAQ. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-sidebar-foreground/60 text-sm">
              Made with 💚 for GCC sustainability
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
