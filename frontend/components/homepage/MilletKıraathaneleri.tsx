"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/layout/Card"
import { Lens } from "@/components/ui/lens"
import { useMediaQuery } from "@/components/ui/use-media-query"

export function MilletKiraathaneleri() {
  useMediaQuery("(max-width: 768px)");
  const kiraathaneData = [
    {
      name: "Beyoğlu Millet Kıraathanesi",
      description: "İstanbul'un kalbinde kültür ve sanatın buluşma noktası.",
      image:
        "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
      name: "Kadıköy Millet Kıraathanesi",
      description: "Anadolu yakasının en gözde kitap ve sohbet mekanı.",
      image:
        "https://images.unsplash.com/photo-1610632380989-680fe40816c6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
      name: "Üsküdar Millet Kıraathanesi",
      description: "Boğaz manzarasında keyifli okuma saatleri için ideal ortam.",
      image:
        "https://images.unsplash.com/photo-1519682577862-22b62b24e493?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
      name: "Beşiktaş Millet Kıraathanesi",
      description: "Öğrencilerin ve kitapseverlerin buluşma noktası.",
      image:
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
      name: "Fatih Millet Kıraathanesi",
      description: "Tarihi atmosferde bilgi ve kültür alışverişi.",
      image:
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2053&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
  ]

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent text-center bg-gradient-to-br from-purple-700 to-purple-900 dark:from-purple-400 dark:to-purple-600 mb-4">
        Millet Kıraathaneleri
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {kiraathaneData.map((kiraathane, index) => (
          <Card key={index} className="relative shadow-md h-full flex flex-col">
            <CardHeader className="p-0">
              <Lens zoomFactor={1.5} lensSize={100} isStatic={false} ariaLabel="Yakınlaştırma Alanı">
                <img
                  src={kiraathane.image || "/placeholder.svg"}
                  alt={`${kiraathane.name} görüntüsü`}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </Lens>
            </CardHeader>
            <CardContent className="flex-grow pt-4">
              <CardTitle className="text-xl">{kiraathane.name}</CardTitle>
              <CardDescription className="mt-2">{kiraathane.description}</CardDescription>
            </CardContent>
            <CardFooter className="space-x-2" />
          </Card>
        ))}
      </div>
    </div>
  )
}
