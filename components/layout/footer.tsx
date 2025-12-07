import Link from "next/link";
import { ChefHat, Github, Twitter } from "lucide-react";
import Tag from "../ui/neu-tag";

export function Footer() {
  return (
    <footer className="bg-charcoal text-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange border-2 border-cream">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">AfroChef</span>
            </Link>
            <p className="text-cream/80 max-w-md">
              Discover the rich culinary traditions of Africa. Browse,
              customize, and share authentic recipes from across the continent.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/recipes"
                  className="text-cream/80 hover:text-orange transition-colors"
                >
                  Browse Recipes
                </Link>
              </li>
              <li>
                <Link
                  href="/builder"
                  className="text-cream/80 hover:text-orange transition-colors"
                >
                  Recipe Builder
                </Link>
              </li>
              <li>
                <Link
                  href="/my"
                  className="text-cream/80 hover:text-orange transition-colors"
                >
                  My Kitchen
                </Link>
              </li>
            </ul>
          </div>

          {/* Regions */}
          <div>
            <h4 className="font-bold text-lg mb-4">Explore Regions</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/recipes?region=West Africa"
                  className="text-cream/80 hover:text-orange transition-colors"
                >
                  West Africa
                </Link>
              </li>
              <li>
                <Link
                  href="/recipes?region=East Africa"
                  className="text-cream/80 hover:text-orange transition-colors"
                >
                  East Africa
                </Link>
              </li>
              <li>
                <Link
                  href="/recipes?region=North Africa"
                  className="text-cream/80 hover:text-orange transition-colors"
                >
                  North Africa
                </Link>
              </li>
              <li>
                <Link
                  href="/recipes?region=Southern Africa"
                  className="text-cream/80 hover:text-orange transition-colors"
                >
                  Southern Africa
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cream/20 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cream/60 text-sm">
            &copy; {new Date().getFullYear()} AfroChef. Made with love for
            African cuisine.
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-charcoal/70 text-xs font-medium">
              AfroChef is designed, built, and backed by
            </span>
            <Tag href="https://dripcodestudio.com/" variant="primary">
              DripCode Studio™
            </Tag>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/60 hover:text-orange transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/60 hover:text-orange transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
