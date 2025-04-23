"use client";
import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Menu } from "lucide-react"
import { Button } from "@/components/ui/form/button"
import { Header } from "@/components/homepage/Header"
import { Footer } from "@/components/homepage/Footer"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#3D3732] text-gray-100">
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left side - Dark section with image */}
        <div className="relative h-full overflow-hidden rounded-lg shadow-xl">
          <Image
            src="/kitap.jpg"
            alt="Vintage open books with textured background"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover hover:scale-105 transition-transform duration-300"
            priority
            style={{ objectPosition: 'center' }}
          />
        </div>

        {/* Right side - Content section */}
        <div className="bg-[#3D3732] p-8 flex flex-col text-gray-100">
          <div className="py-4">{/* Navigation removed as requested */}</div>

          <div className="flex-1 flex flex-col justify-center max-w-xl">
            <h1 className="text-4xl font-bold mb-8">
              Hakkımızda
            </h1>

            <div className="mb-12">
              <div>
                <p className="text-lg leading-relaxed text-gray-200 italic max-w-2xl mx-auto">
                  OkuYorum, kitapların yalnızca raflarda değil, insanların hayatlarında dolaşmasını amaçlayan bir sosyal kitap paylaşım platformudur.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 text-left">
                <p className="text-base leading-relaxed text-gray-300">
                  Millet kıraathaneleri ve bireyler arasında kitap dolaşımını teşvik ederken, kullanıcılar arasında kültürel bağlar kurmayı hedefliyoruz. <span className="italic text-gray-200">Paylaştığınız her kitap bir başkasının dünyasını değiştirebilir.</span>
                </p>

                <p className="text-base leading-relaxed text-gray-300">
                  OkuYorum, sadece bir kitap paylaşım ağı değil; aynı zamanda insanların bir araya gelip fikir alışverişi yaptığı, ortak ilgi alanları etrafında buluştuğu bir kültür platformudur. <span className="italic text-gray-200">Her kitap, yeni bir sohbetin kapısını aralar, her etkinlik yeni dostluklara zemin hazırlar.</span> Biz, kitapların yalnızca raflarda değil, insanlar arasında dolaşarak hikâyelere dönüşmesini istiyoruz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 bg-[#3D3732]">
        <section className="w-full py-12 md:py-24">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tight md:text-5xl font-serif text-gray-100">Hikayemiz</h2>
              <p className="text-lg leading-relaxed text-gray-200 italic">
                OkuYorum, okumayı ve paylaşmayı seven bireyleri bir araya getirmek için doğdu.
              </p>
              <p className="text-lg leading-relaxed text-gray-300">
                Her bireyin kitaplıkları sadece kendisine ait değil, topluma da katkı sağlayabilir düşüncesiyle yola çıktık. <span className="italic text-gray-200">Proje, millet kıraathanelerini dijitalleştirerek daha erişilebilir, etkileşimli ve katılımcı hale getirmeyi amaçlar.</span>
              </p>
            </div>
            <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-xl bg-[#3D3732]">
              <Image
                src={'/kitap2.jpg'}
                alt="Kütüphanede kitap seçen bir kişi"
                width={800}
                height={400}
                style={{ objectFit: 'cover' }}
                className="hover:scale-105 transition-transform duration-300"
                priority
                unoptimized
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-[#3D3732]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-4xl font-black tracking-tight md:text-5xl font-serif text-gray-100">Ekibimiz</h2>
              <p className="mx-auto max-w-[700px] text-lg leading-relaxed text-gray-200 italic">
                Bizi tanıyın!
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <TeamMember
                name="Ayşenur Şirin"
                role="Dev"
                bio="With over 15 years of experience in interior design, Jane leads our creative vision."
              />
              <TeamMember
                name="Enfal Yetiş"
                role="Dev"
                bio="John specializes in contemporary design and has transformed hundreds of properties."
              />
              <TeamMember
                name="Belkız Özbek"
                role="Dev"
                bio="Sarah ensures every project runs smoothly from consultation to completion."
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-[#3D3732]">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-4xl font-black tracking-tight md:text-5xl font-serif text-gray-100">Yaklaşımımız</h2>
                <p className="text-lg leading-relaxed text-gray-200 italic">
                  Millet kıraathanelerini sadece bir okuma alanı değil, paylaşım ve etkileşim merkezi olarak görüyoruz.
                </p>
                <p className="text-lg leading-relaxed text-gray-300">
                  OkuYorum'da kitaplar bağışlanıyor, elden ele dolaşıyor ve tartışmalarla yeni fikirler doğuruyor.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-gray-200 flex-shrink-0 mt-0.5" />
                    <span className="text-lg leading-relaxed text-gray-300 italic">Her kıraathane için özel etkinlik planlaması</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-gray-200 flex-shrink-0 mt-0.5" />
                    <span className="text-lg leading-relaxed text-gray-300 italic">Kitap paylaşımını teşvik eden dijital altyapı</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-gray-200 flex-shrink-0 mt-0.5" />
                    <span className="text-lg leading-relaxed text-gray-300 italic">Topluluk etkileşimini artıran kültürel tartışma ortamları</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-gray-200 flex-shrink-0 mt-0.5" />
                    <span className="text-lg leading-relaxed text-gray-300 italic">Kıraathanelerin sosyal rolünü güçlendirme odaklı yaklaşım</span>
                  </li>
                </ul>
              </div>
              <div className="relative h-[600px] overflow-hidden rounded-lg shadow-xl">
                <Image
                  src="/kitaplık.jpg"
                  alt="Kütüphane koridoru ve kitap rafları"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-[#3D3732]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-4xl font-black tracking-tight md:text-5xl font-serif text-gray-100">Hadi Birlikte Okuyalım!</h2>
              <p className="mx-auto max-w-[700px] text-lg leading-relaxed text-gray-200 italic">
                Kitabını kap, kıraathaneye gel! OkuYorum'la her kitap bir yolculuğa çıkar, her paylaşım bir iyiliğe dönüşür.
              </p>
              <Link href="/">
                <Button className="mt-4 bg-[#4A443E] text-gray-100 hover:bg-[#5A544E] shadow-lg hover:shadow-xl transition-all duration-300">
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

function TeamMember({ name, role, bio }: { name: string; role: string; bio: string }) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="h-40 w-40 overflow-hidden rounded-full bg-[#3D3732]">
        <Image
          src="/placeholder.svg?height=720&width=1280"
          alt={name}
          width={160}
          height={160}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="space-y-2 text-center">
        <h3 className="text-2xl font-bold tracking-tight text-gray-100">{name}</h3>
        <p className="text-base text-gray-200 italic">{role}</p>
        <p className="text-base text-gray-300">{bio}</p>
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
