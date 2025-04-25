"use client";
import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Menu } from "lucide-react"
import { Button } from "@/components/ui/form/button"
import { Header } from "@/components/homepage/Header"
import { Footer } from "@/components/homepage/Footer"
import { AnimatedIcons } from "@/components/homepage/AnimatedIcons"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left side - Dark section with image */}
        <div className="relative bg-background">
          <Image
            src="/b4.jpg"
            alt="Artistic installation"
            width={960}
            height={1080}
            className="object-cover w-full h-full opacity-90"
          />
        </div>

        {/* Right side - Content section */}
        <div className="bg-background p-8 flex flex-col">
          <div className="py-4">{/* Navigation removed as requested */}</div>

          <div className="flex-1 flex flex-col justify-start max-w-xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8 font-serif text-foreground/80 ml-12">
              Hakkımızda
            </h1>

            <p className="text-lg leading-relaxed text-muted-foreground italic text-center mb-12 max-w-2xl mx-auto">
              OkuYorum, kitapların yalnızca raflarda değil, insanların hayatlarında dolaşmasını amaçlayan bir sosyal kitap paylaşım platformudur.
            </p>

            
              <div className="space-y-6 text-center max-w-2xl mx-auto">
                <p className="text-base leading-relaxed text-muted-foreground">
                  Millet kıraathaneleri ve bireyler arasında kitap dolaşımını teşvik ederken, kullanıcılar arasında kültürel bağlar kurmayı hedefliyoruz. <span className="italic">Paylaştığınız her kitap bir başkasının dünyasını değiştirebilir.</span>
                </p>

                <p className="text-base leading-relaxed text-muted-foreground">
                  OkuYorum, sadece bir kitap paylaşım ağı değil; aynı zamanda insanların bir araya gelip fikir alışverişi yaptığı, ortak ilgi alanları etrafında buluştuğu bir kültür platformudur. <span className="italic">Her kitap, yeni bir sohbetin kapısını aralar, her etkinlik yeni dostluklara zemin hazırlar.</span> Biz, kitapların yalnızca raflarda değil, insanlar arasında dolaşarak hikâyelere dönüşmesini istiyoruz.
                </p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tight md:text-5xl font-serif text-foreground/80">Hikayemiz</h2>
              <p className="text-lg leading-relaxed text-muted-foreground italic">
                OkuYorum, okumayı ve paylaşmayı seven bireyleri bir araya getirmek için doğdu.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Her bireyin kitaplıkları sadece kendisine ait değil, topluma da katkı sağlayabilir düşüncesiyle yola çıktık. <span className="italic">Proje, millet kıraathanelerini dijitalleştirerek daha erişilebilir, etkileşimli ve katılımcı hale getirmeyi amaçlar.</span>
              </p>
            </div>
            <div className="aspect-video overflow-hidden rounded-lg">
              <Image
                src="/b7.jpg"
                alt="Team working on home staging"
                width={1280}
                height={720}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-4xl font-black tracking-tight md:text-5xl font-serif text-foreground/80">Ekibimiz</h2>
              <p className="mx-auto max-w-[700px] text-lg leading-relaxed text-muted-foreground italic">
                Bizi tanıyın!
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <TeamMember
                name="Ayşenur Şirin"
                role="Dev"
                image="/aysenur.png"
              />
               <TeamMember
                name="Belkız Özbek"
                role="Dev"                
                image="/belkiz.png"
              />
              <TeamMember
                name="Enfal Yetiş"
                role="Dev"
                image="/enfal.png"
              />
             
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-4xl font-black tracking-tight md:text-5xl font-serif text-foreground/80">Yaklaşımımız</h2>
                <p className="text-lg leading-relaxed text-muted-foreground italic">
                  Millet kıraathanelerini sadece bir okuma alanı değil, paylaşım ve etkileşim merkezi olarak görüyoruz.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  OkuYorum'da kitaplar bağışlanıyor, elden ele dolaşıyor ve tartışmalarla yeni fikirler doğuruyor.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-lg leading-relaxed text-muted-foreground italic">Her kıraathane için özel etkinlik planlaması</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-lg leading-relaxed text-muted-foreground italic">Kitap paylaşımını teşvik eden dijital altyapı</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-lg leading-relaxed text-muted-foreground italic">Topluluk etkileşimini artıran kültürel tartışma ortamları</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-lg leading-relaxed text-muted-foreground italic">Kıraathanelerin sosyal rolünü güçlendirme odaklı yaklaşım</span>
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <AnimatedIcons />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-4xl font-black tracking-tight md:text-5xl font-serif text-foreground/80">Hadi Birlikte Okuyalım!</h2>
              <p className="mx-auto max-w-[700px] text-lg leading-relaxed text-muted-foreground italic">
                Kitabını kap, kıraathaneye gel! OkuYorum'la her kitap bir yolculuğa çıkar, her paylaşım bir iyiliğe dönüşür.
              </p>
              <Link href="/">
                <Button className="mt-4 bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300">
                  Hemen Başla
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function TeamMember({ name, role, image }: { name: string; role: string; image: string }) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="h-40 w-40 overflow-hidden rounded-full">
        <Image
          src={image}
          alt={name}
          width={160}
          height={160}
          className="object-cover w-full h-full"
          onError={(e) => {
            console.error(`Error loading image for ${name}:`, image);
            e.currentTarget.src = '/placeholder.svg?height=720&width=1280';
          }}
        />
      </div>
      <div className="space-y-2 text-center">
        <h3 className="text-2xl font-bold tracking-tight text-foreground/80">{name}</h3>
        <p className="text-base text-muted-foreground italic">{role}</p>
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
