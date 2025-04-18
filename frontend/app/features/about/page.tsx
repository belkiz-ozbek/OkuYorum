"use client";

import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Menu } from "lucide-react"
import { Button } from "@/components/ui/form/button"
import { Header } from "@/components/homepage/Header"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left side - Dark section with image */}
        <div className="relative bg-black">
          <div className="absolute top-8 left-8">
          </div>
          <Image
            src="/placeholder.svg?height=1080&width=960"
            alt="Artistic installation"
            width={960}
            height={1080}
            className="object-cover w-full h-full opacity-90"
          />
        </div>

        {/* Right side - Content section */}
        <div className="bg-[#f8f5f2] p-8 flex flex-col">
          <div className="py-4">{/* Navigation removed as requested */}</div>

          <div className="flex-1 flex flex-col justify-center max-w-xl">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif mb-12">About us.</h1>

            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="text-lg leading-relaxed">
                  Focused on excellence for our clients, we are well established, with a reputation for great service
                  and a high-quality finish.
                </p>
              </div>

              <div className="space-y-6">
                <p className="text-sm leading-relaxed">
                  With our roots in high end production, TRUE works on a wide spectrum of projects, with top
                  international event organisers and designers. We delight in diversity, from luxury brand experiences
                  to ambitious, large-scale live events.
                </p>

                <p className="text-sm leading-relaxed">
                  The magic happens at TRUE HQ - a 4,000m2 manufacturing facility in Billericay, Essex. A large,
                  flexible space that's reconfigured for every job, creating the optimum work environment with plenty of
                  room to test-build your project prior to delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Our Story</h2>
              <p className="text-gray-500 md:text-lg">
                True Staging was founded with a passion for interior design and a deep understanding of the real estate
                market. Our journey began with a simple mission: to help property owners showcase their homes in the
                best possible light.
              </p>
              <p className="text-gray-500 md:text-lg">
                With years of experience in the industry, we've developed a keen eye for design and a strategic approach
                to home staging that consistently delivers results for our clients.
              </p>
            </div>
            <div className="aspect-video overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=720&width=1280"
                alt="Team working on home staging"
                width={1280}
                height={720}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-[#f8f8f8]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Our Team</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg">
                Meet the talented professionals behind True Staging's success.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <TeamMember
                name="Jane Smith"
                role="Founder & Lead Designer"
                bio="With over 15 years of experience in interior design, Jane leads our creative vision."
              />
              <TeamMember
                name="John Davis"
                role="Senior Stager"
                bio="John specializes in contemporary design and has transformed hundreds of properties."
              />
              <TeamMember
                name="Sarah Johnson"
                role="Project Manager"
                bio="Sarah ensures every project runs smoothly from consultation to completion."
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Our Approach</h2>
                <p className="text-gray-500 md:text-lg">
                  We believe that every property has unique potential. Our approach combines aesthetic expertise with
                  market knowledge to create spaces that appeal to target buyers.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-black flex-shrink-0 mt-0.5" />
                    <span className="text-gray-500">Personalized consultation for each property</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-black flex-shrink-0 mt-0.5" />
                    <span className="text-gray-500">Strategic furniture and decor selection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-black flex-shrink-0 mt-0.5" />
                    <span className="text-gray-500">Attention to detail in every room</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-black flex-shrink-0 mt-0.5" />
                    <span className="text-gray-500">Focus on highlighting architectural features</span>
                  </li>
                </ul>
              </div>
              <div className="aspect-video overflow-hidden rounded-lg">
                <Image
                  src="/placeholder.svg?height=720&width=1280"
                  alt="Staged living room"
                  width={1280}
                  height={720}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-black text-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Why Choose Us</h2>
                <p className="md:text-lg">
                  Our commitment to excellence and attention to detail sets us apart in the home staging industry.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Experience</h3>
                    <p className="text-gray-300">Years of industry expertise</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Quality</h3>
                    <p className="text-gray-300">Premium furniture and decor</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Results</h3>
                    <p className="text-gray-300">Proven track record of success</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Service</h3>
                    <p className="text-gray-300">Personalized client experience</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative h-[400px] w-[400px] rounded-full bg-white/10 flex items-center justify-center">
                  <div className="absolute inset-4 rounded-full bg-white/5 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <h3 className="text-4xl font-bold">500+</h3>
                      <p className="text-xl">Properties Staged</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Transform Your Property?</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg">
                Contact us today to schedule a consultation and discover how True Staging can help you maximize your
                property's potential.
              </p>
              <Button className="mt-4 bg-black text-white hover:bg-gray-800">Contact Us</Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-white py-6">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500">© 2023 True Staging. All rights reserved.</p>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

function TeamMember({ name, role, bio }: { name: string; role: string; bio: string }) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="h-40 w-40 overflow-hidden rounded-full">
        <Image
          src="/placeholder.svg?height=160&width=160"
          alt={name}
          width={160}
          height={160}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="space-y-2 text-center">
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="text-sm text-gray-500">{role}</p>
        <p className="text-sm text-gray-500">{bio}</p>
      </div>
    </div>
  )
}

function MobileMenu() {
  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" className="text-black" aria-label="Open Menu">
        <Menu className="h-6 w-6" />
      </Button>
      {/* Mobile menu would be implemented with state management in a real application */}
    </div>
  )
}
