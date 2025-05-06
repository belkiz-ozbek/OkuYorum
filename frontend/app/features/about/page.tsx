"use client"
import Link from "next/link"
import { Header } from "@/components/homepage/Header"
import { Footer } from "@/components/homepage/Footer"
import { CallToAction } from "@/components/homepage/CallToAction"
import { motion } from "framer-motion"
import { ChevronRight, BookOpen, Heart, MessageSquare, Users, Target, Compass, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      {/* Hero Section - Biz Kimiz? */}
      <section className="relative overflow-hidden bg-background py-20 md:py-28">
        <div className="absolute inset-0 bg-[url('/subtle-pattern.png')] opacity-5 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="order-2 lg:order-1"
              >
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#f0ebff] text-[#8a3ffc] text-sm font-medium mb-6">
                  <span>2025'den beri kitapseverlerle</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Biz Kimiz?</h1>
                <div className="space-y-4 text-gray-700">
                  <p className="text-lg leading-relaxed">
                    <span className="font-semibold text-[#8a3ffc]">OkuYorum</span>, 2025 yılında Ankara Yıldırım Beyazıt
                    Üniversitesi Bilgisayar Mühendisliği öğrencileri tarafından kurulmuş, kitapseverleri ve toplulukları
                    bir araya getiren yenilikçi bir sosyal kitap paylaşım platformudur.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Türkiye'de kitap okuma oranlarının düşük olması ve kitaplara erişimin sınırlı olması sorunlarına
                    çözüm olarak doğan projemiz, kitapların yalnızca raflarda değil, insanların hayatlarında dolaşmasını
                    amaçlamaktadır.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Millet kıraathaneleri ve bireyler arasında kitap dolaşımını teşvik ederken, kullanıcılar arasında
                    kültürel bağlar kurmayı hedefliyoruz.
                  </p>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button className="bg-[#8a3ffc] hover:bg-[#7b38e3] text-white">
                    Daha Fazla Keşfet
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="border-[#8a3ffc] text-[#8a3ffc] hover:bg-[#f0ebff]">
                    Ekibimizle Tanışın
                  </Button>
                </div>

                <div className="mt-10 grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#8a3ffc]">5K+</div>
                    <div className="text-sm text-gray-500">Aktif Kullanıcı</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#8a3ffc]">15K+</div>
                    <div className="text-sm text-gray-500">Paylaşılan Kitap</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#8a3ffc]">25+</div>
                    <div className="text-sm text-gray-500">Kıraathane</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="order-1 lg:order-2"
              >
                <div className="relative">
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#f0ebff] rounded-lg z-0"></div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#f0ebff] rounded-lg z-0"></div>
                  <div className="relative z-10 bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="aspect-[4/3] bg-[#f0ebff] flex items-center justify-center">
                      <BookOpen className="h-20 w-20 text-[#8a3ffc]" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f0ebff] mb-4">
                <Target className="h-8 w-8 text-[#8a3ffc]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#8a3ffc]">Misyonumuz</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg p-8 shadow-md border-t-4 border-[#8a3ffc]"
              >
                <h3 className="text-xl font-bold mb-4 text-[#8a3ffc]">Platformun Çekirdek Amacı</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#f0ebff] flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-[#8a3ffc] text-sm font-bold">1</span>
                    </div>
                    <p className="text-gray-700">
                      <span className="font-semibold">Kişisel Kütüphane Yönetimi:</span> Kullanıcıların kitaplarını
                      dijital ortamda düzenlemesi, takip etmesi ve yönetmesi için kullanıcı dostu bir platform sunmak.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#f0ebff] flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-[#8a3ffc] text-sm font-bold">2</span>
                    </div>
                    <p className="text-gray-700">
                      <span className="font-semibold">Kitap Paylaşımı:</span> İnsanlar arasında kitap dolaşımını
                      kolaylaştırarak bilginin yayılmasını ve erişilebilirliğini artırmak.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#f0ebff] flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-[#8a3ffc] text-sm font-bold">3</span>
                    </div>
                    <p className="text-gray-700">
                      <span className="font-semibold">Topluma Katkı:</span> Millet kıraathaneleri ve ihtiyaç sahibi
                      kütüphanelere kitap bağışı yapılmasını teşvik ederek toplumsal fayda sağlamak.
                    </p>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-lg p-8 shadow-md border-t-4 border-[#8a3ffc]"
              >
                <h3 className="text-xl font-bold mb-4 text-[#8a3ffc]">
                  Kullanıcılara ve Topluluklara Sunduğumuz Değer
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#f0ebff] flex items-center justify-center mr-3 mt-0.5">
                      <BookOpen className="h-3 w-3 text-[#8a3ffc]" />
                    </div>
                    <p className="text-gray-700">
                      Okuyucular için zengin bir kitap keşif deneyimi ve kişiselleştirilmiş öneriler sunuyoruz.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#f0ebff] flex items-center justify-center mr-3 mt-0.5">
                      <MessageSquare className="h-3 w-3 text-[#8a3ffc]" />
                    </div>
                    <p className="text-gray-700">
                      Kitap severler için düşüncelerini paylaşabilecekleri ve benzer ilgi alanlarına sahip kişilerle
                      bağlantı kurabilecekleri bir topluluk oluşturuyoruz.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#f0ebff] flex items-center justify-center mr-3 mt-0.5">
                      <Heart className="h-3 w-3 text-[#8a3ffc]" />
                    </div>
                    <p className="text-gray-700">
                      Kütüphaneler ve eğitim kurumları için kitap bağışı sürecini kolaylaştırarak kaynak erişimini
                      artırıyoruz.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#f0ebff] flex items-center justify-center mr-3 mt-0.5">
                      <Users className="h-3 w-3 text-[#8a3ffc]" />
                    </div>
                    <p className="text-gray-700">
                      Millet kıraathaneleri için dijital envanter yönetimi ve etkinlik organizasyonu desteği sağlıyoruz.
                    </p>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-4">
              <Compass className="h-8 w-8 text-[#8a3ffc]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#8a3ffc]">Vizyonumuz</h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-white rounded-lg p-8 shadow-md relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-[#8a3ffc]"></div>
              <div className="relative z-10">
                <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                  Uzun vadede, <span className="font-semibold text-[#8a3ffc]">OkuYorum</span> olarak:
                </p>
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#f0ebff] flex items-center justify-center mr-4">
                      <span className="text-[#8a3ffc] font-bold">01</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#8a3ffc] mb-2">Kitap Okuma Kültürünü Yaygınlaştırmak</h3>
                      <p className="text-gray-600">
                        Türkiye'de kitap okuma alışkanlığını artırmak ve okuma kültürünü toplumun her kesimine yaymak
                        için çalışıyoruz.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#f0ebff] flex items-center justify-center mr-4">
                      <span className="text-[#8a3ffc] font-bold">02</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#8a3ffc] mb-2">
                        Dijital Kütüphane Sistemi Kurmak
                      </h3>
                      <p className="text-gray-600">
                      Herkesin erişebileceği, kullanımı kolay ve kapsayıcı dijital kütüphane altyapısı 
                      sağlamayı hedefliyoruz.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#f0ebff] flex items-center justify-center mr-4">
                      <span className="text-[#8a3ffc] font-bold">03</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#8a3ffc] mb-2">
                        Topluluk Temelli Bir Ekosistem Oluşturmak
                      </h3>
                      <p className="text-gray-600">
                        Kitap severler, yazarlar, kütüphaneler ve eğitim kurumları arasında sürdürülebilir bir etkileşim
                        ağı kurarak bilgi paylaşımını ve kültürel zenginliği artırmayı amaçlıyoruz.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#f0ebff] flex items-center justify-center mr-4">
                      <span className="text-[#8a3ffc] font-bold">04</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#8a3ffc] mb-2">
                        Teknoloji ile Geleneksel Okuma Deneyimini Zenginleştirmek
                      </h3>
                      <p className="text-gray-600">
                        Modern teknolojileri kullanarak geleneksel kitap okuma deneyimini tamamlayıcı ve zenginleştirici
                        çözümler geliştirmeye odaklanıyoruz.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#8a3ffc]">Platformumuz sizin için tasarlandı</h2>
            <p className="text-gray-500">
              Kitap severlerin ve toplulukların ihtiyaçlarını karşılamak için özel olarak geliştirdik
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProcessCard
              icon="📚"
              title="Kitaplarınızı ekleyin"
              description="Kişisel kütüphanenize kitaplarınızı ekleyin ve düzenleyin."
              hasArrow={true}
            />

            <ProcessCard
              icon="✍️"
              title="İncelemeler yazın"
              description="Okuduğunuz kitaplar hakkında düşüncelerinizi paylaşın ve alıntılar ekleyin."
              hasArrow={true}
            />

            <ProcessCard
              icon="🔍"
              title="Kitapları keşfedin"
              description="Diğer kullanıcıların incelemelerini okuyun ve yeni kitaplar keşfedin."
              hasArrow={true}
            />

            <ProcessCard
              icon="🎁"
              title="Kitap bağışlayın"
              description="İhtiyacı olan kütüphanelere kitaplarınızı bağışlayarak topluma katkıda bulunun."
              hasArrow={false}
            />
          </div>
        </div>
      </section>


            {/* Testimonials Section */}
            <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#8a3ffc]">Kullanıcı Yorumları</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Kullanıcılarımızın OkuYorum deneyimleri hakkında ne söylediklerini keşfedin. İşte bazı geribildirimler.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <TestimonialCard
              name="Ahmet Yılmaz"
              role="Kitap Kurdu"
              rating={5}
              text="Kitap koleksiyonumu düzenlemek için harika bir platform. Artık hangi kitapları okuduğumu ve arkadaşlarıma ödünç verdiğimi kolayca takip edebiliyorum."
            />

            <TestimonialCard
              name="Zeynep Kaya"
              role="Öğretmen"
              rating={4}
              text="Öğrencilerime kitap önerileri yapmak için kullanıyorum. Platform çok kullanışlı ve sınıfım için kitap bağışı toplamama da yardımcı oldu."
            />

            <TestimonialCard
              name="Murat Demir"
              role="Kütüphane Yöneticisi"
              rating={5}
              text="Kütüphanemiz için kitap bağışı almak çok daha kolay hale geldi. Kullanıcı arayüzü sezgisel ve topluluk çok yardımsever."
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#8a3ffc]">Ekibimiz</h2>
            <p className="text-gray-500 max-w-3xl mx-auto">
              OkuYorum, tutkulu ve yetenekli bir ekip tarafından geliştirilmiştir. Kitap sevgisi ve teknoloji tutkusuyla
              bir araya gelen ekibimiz, kullanıcılarımıza en iyi deneyimi sunmak için çalışmaktadır.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <TeamMember
              name="Enfal Yetiş"
              role="Kurucu & Backend Developer"
              bio="Bilgisayar Mühendisliği öğrencisi olan Enfal, OkuYorum'un teknik altyapısından sorumludur. Yazılım geliştirme ve veri tabanı yönetimi konularında uzmanlaşmıştır."
              skills={["Backend Geliştirme", "Veri Tabanı Tasarımı", "Yapay Zeka"]}
              socialLinks={{
                github: "https://github.com/EnfalYetis",
                linkedin: "https://www.linkedin.com/in/enfal-yeti%C5%9F-152781233/",
                twitter: "https://x.com/lafneli",
              }}
            />

            <TeamMember
              name="Ayşenur Şirin"
              role="Kurucu & Frontend Developer"
              bio="Ayşenur, kullanıcı deneyimi ve arayüz tasarımı konusunda uzmanlaşmış bir Bilgisayar Mühendisliği öğrencisidir. OkuYorum'un kullanıcı dostu arayüzünün arkasındaki yaratıcıdır."
              skills={["UI/UX Tasarım", "Frontend Geliştirme", "Kullanıcı Araştırması"]}
              socialLinks={{
                github: "https://github.com/sirinn00",
                linkedin: "https://linkedin.com/in/aysenursirin",
                twitter: "https://x.com/aysiriin",
              }}
            />

            <TeamMember
              name="Belkız Özbek"
              role="Kurucu & Backend Developer"
              bio="Belkız, proje yönetimi ve iş geliştirme konularında deneyimli bir Bilgisayar Mühendisliği öğrencisidir. OkuYorum'un backend geliştirme ve veri tabanı yönetiminden sorumludur."
              skills={["Backend Geliştirme", "Veri Tabanı Yönetimi", "API Entegrasyonu"]}
              socialLinks={{
                github: "https://github.com/belkiz-ozbek",
                linkedin: "https://www.linkedin.com/in/belk%C4%B1z-%C3%B6zbek-69b626246/",
                twitter: "https://twitter.com/belkizozbek",
              }}
            />
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#8a3ffc]">Kullandığımız Teknolojiler</h2>
            <p className="text-gray-500 max-w-3xl mx-auto">
              OkuYorum platformu, modern ve güvenilir teknolojiler kullanılarak geliştirilmiştir.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            <TechnologyCard name="Java" />
            <TechnologyCard name="Spring Boot" />
            <TechnologyCard name="Next.js" />
            <TechnologyCard name="PostgreSQL" />
            <TechnologyCard name="Docker" />
            <TechnologyCard name="GitHub" />
          </div>
        </div>
      </section>


      <CallToAction/>
      <Footer />
    </div>
  )
}

function ProcessCard({
  icon,
  title,
  description,
  hasArrow,
}: {
  icon: string
  title: string
  description: string
  hasArrow: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative bg-white p-6 rounded-lg border shadow-sm"
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-[#f0ebff] flex items-center justify-center mb-4 text-2xl">{icon}</div>
        <h3 className="text-lg font-semibold mb-2 text-[#8a3ffc]">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>

      {hasArrow && (
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 z-10 hidden md:block">
          <ChevronRight className="h-6 w-6 text-[#8a3ffc]" />
        </div>
      )}
    </motion.div>
  )
}

function CategoryCard({ title }: { title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="aspect-video relative bg-[#f0ebff] flex items-center justify-center">
        <span className="text-[#8a3ffc]">Görsel</span>
      </div>
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold text-[#8a3ffc]">{title}</h3>
      </div>
    </motion.div>
  )
}

function TeamMember({
  name,
  role,
  bio,
  skills,
  socialLinks,
}: {
  name: string
  role: string
  bio: string
  skills: string[]
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
  }
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group"
    >
      <div className="relative">
        <div className="aspect-[4/3] bg-gradient-to-br from-[#8a3ffc] to-[#b57aff] flex items-center justify-center">
          <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white">
            <span className="text-4xl font-bold text-white">{name.charAt(0)}</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-[#8a3ffc] mb-1 group-hover:text-[#7b38e3] transition-colors">{name}</h3>
        <p className="text-gray-600 font-medium mb-4">{role}</p>

        <p className="text-gray-700 mb-4 text-sm leading-relaxed">{bio}</p>

        <div className="mb-5">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Uzmanlık Alanları:</h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} className="text-xs bg-[#f0ebff] text-[#8a3ffc] px-2 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          {socialLinks.github && (
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#8a3ffc] transition-colors"
              aria-label={`${name}'in GitHub profili`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
          )}

          {socialLinks.linkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#8a3ffc] transition-colors"
              aria-label={`${name}'in LinkedIn profili`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          )}

          {socialLinks.twitter && (
            <a
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#8a3ffc] transition-colors"
              aria-label={`${name}'in Twitter profili`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function TechnologyCard({ name }: { name: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow p-4 text-center"
    >
      <div className="w-16 h-16 bg-[#f0ebff] rounded-full mx-auto mb-3 flex items-center justify-center">
        <span className="text-lg font-bold text-[#8a3ffc]">{name.charAt(0)}</span>
      </div>
      <h3 className="text-sm font-semibold text-[#8a3ffc]">{name}</h3>
    </motion.div>
  )
}

function TestimonialCard({ name, role, rating, text }: { name: string; role: string; rating: number; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-5 w-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
        ))}
      </div>

      <p className="text-gray-700 mb-4 min-h-[80px]">{text}</p>

      <div className="flex items-center">
        <div className="w-10 h-10 bg-[#f0ebff] rounded-full flex items-center justify-center mr-3">
          <span className="text-sm font-bold text-[#8a3ffc]">{name.charAt(0)}</span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">{name}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </motion.div>
  )
}
