"use client"
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { BookOpen, CheckCircle2, AlertTriangle, Clock, Star, Book, Users } from "lucide-react"

const pieData = [
  { name: "1–7 gün", value: 62 },
  { name: "8–14 gün", value: 25 },
  { name: "15+ gün", value: 13 },
]

// Yeni veri: Aylara göre ortalama iade süresi (gün olarak)
const iadeSuresiData = [
  { name: "Ocak", ortalamaSure: 8 },
  { name: "Şub", ortalamaSure: 7 },
  { name: "Mar", ortalamaSure: 9 },
  { name: "Nis", ortalamaSure: 6 },
  { name: "May", ortalamaSure: 8 },
  { name: "Haz", ortalamaSure: 7 },
  { name: "Tem", ortalamaSure: 10 },
  { name: "Ağu", ortalamaSure: 12 },
  { name: "Eyl", ortalamaSure: 9 },
  { name: "Ekim", ortalamaSure: 7 },
  { name: "Kas", ortalamaSure: 6 },
  { name: "Ara", ortalamaSure: 8 },
]

const islemData = [
  { name: "Ocak", islemler: 30, iadeler: 12 },
  { name: "Şub", islemler: 25, iadeler: 9 },
  { name: "Mar", islemler: 40, iadeler: 15 },
  { name: "Nis", islemler: 35, iadeler: 11 },
  { name: "May", islemler: 50, iadeler: 18 },
  { name: "Haz", islemler: 50, iadeler: 18 },
  { name: "Tem", islemler: 50, iadeler: 18 },
  { name: "Ağu", islemler: 50, iadeler: 18 },
  { name: "Eyl", islemler: 50, iadeler: 18 },
  { name: "Ekim", islemler: 50, iadeler: 18 },
  { name: "Kas", islemler: 50, iadeler: 18 },
  { name: "Ara", islemler: 50, iadeler: 18 },
  // … kendi aylık/veri girişlerinizi buraya ekleyin
]

const COLORS = ["#d4c1ff", "#a5ecc9", "#a8d1ff"]

const stats = [
  {
    label: "Toplam Kitap",
    value: 12,
    icon: <BookOpen className="w-6 h-6 text-[#d4c1ff]" />,
    bg: "bg-[#f8f5ff]",
    description: "Şimdiye kadar verdiğin kitap sayısı",
  },
  {
    label: "İade Edilen",
    value: 9,
    icon: <CheckCircle2 className="w-6 h-6 text-[#a5ecc9]" />,
    bg: "bg-[#f0fcf7]",
    description: "Zamanında geri gelen kitaplar",
  },
  {
    label: "Geciken",
    value: 2,
    icon: <AlertTriangle className="w-6 h-6 text-[#ffbcb0]" />,
    bg: "bg-[#fff5f2]",
    description: "Gecikmeli iade edilen kitaplar",
  },
  {
    label: "Ortalama Süre",
    value: "7 gün",
    icon: <Clock className="w-6 h-6 text-[#a8d1ff]" />,
    bg: "bg-[#f5f9ff]",
    description: "Kitapların ortalama iade süresi",
  },
  {
    label: "Ortalama Puan",
    value: "4.3",
    icon: <Star className="w-6 h-6 text-[#ffe0a3]" />,
    bg: "bg-[#fffaf0]",
    description: "Kitapların ortalama değerlendirme puanı",
  },
]

const popularBooks = [
  { title: "Kürk Mantolu Madonna", author: "Sabahattin Ali", count: 8, rating: 4.8 },
  { title: "Hayvan Çiftliği", author: "George Orwell", count: 6, rating: 4.5 },
  { title: "Satranç", author: "Stefan Zweig", count: 5, rating: 4.7 },
  { title: "Küçük Prens", author: "Antoine de Saint-Exupéry", count: 4, rating: 4.9 },
  { title: "1984", author: "George Orwell", count: 3, rating: 4.6 },
]

const activeUsers = [
  { name: "Enfal Yetiş", count: 12, rating: 4.9 },
  { name: "Ayşenur Şirin", count: 10, rating: 4.7 },
  { name: "Yasemin Yalçın", count: 8, rating: 4.8 },
  { name: "Belkız Özbek", count: 7, rating: 4.6 },
  { name: "Mehmet Yılmaz", count: 6, rating: 4.5 },
]

const bookTypes = [
  { type: "Kurgu", percentage: 30, color: "bg-[#d4c1ff]" },
  { type: "Akademik", percentage: 20, color: "bg-[#a5ecc9]" },
  { type: "Biyografi", percentage: 15, color: "bg-[#a8d1ff]" },
  { type: "Tarih", percentage: 15, color: "bg-[#ffcfa3]" },
  { type: "Diğer", percentage: 20, color: "bg-[#ffe0a3]" },
]

export function IadeSureiDagilimi() {
  return (
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
      <div className="font-semibold text-gray-900 mb-2">İade Süresi Dağılımı</div>
      <div className="flex-1 flex items-center justify-center">
        <PieChart width={200} height={200}>
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {pieData.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(val) => `${val}%`} />
          <Legend layout="vertical" verticalAlign="middle" align="right" />
        </PieChart>
      </div>
      <div className="mt-4 space-y-2 text-xs">
        {pieData.map((item) => (
          <div key={item.name} className="flex justify-between">
            <span className="text-gray-600">{item.name}</span>
            <span className="font-bold text-gray-900">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LoanStatisticsPage() {
  return (
    <div className="min-h-screen bg-[#f6f4fb] py-8 px-2">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Ödünç İstatistikleri</h1>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl p-4 flex flex-col gap-1 shadow bg-white">
              <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${stat.bg}`}>{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</div>
              <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
              <div className="text-xs text-gray-400">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Statistics Chart Placeholder */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6 flex flex-col">
            <div className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Book className="w-5 h-5 text-[#d4c1ff]" /> Kitap Türü Dağılımı
            </div>
            <div className="flex-1 flex flex-col gap-4">
              {bookTypes.map((item) => (
                <div key={item.type} className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 font-medium">{item.type}</span>
                    <span className="font-semibold text-gray-900">{item.percentage}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Ortalama İade Süresi Grafiği */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
            <div className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#a8d1ff]" /> Ortalama İade Süresi
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={iadeSuresiData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    domain={[0, "dataMax + 2"]}
                    tickFormatter={(value) => `${value} gün`}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} gün`, "Ortalama Süre"]}
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    itemStyle={{ padding: "4px 0" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="ortalamaSure"
                    stroke="#a8d1ff"
                    strokeWidth={3}
                    dot={{ fill: "#a8d1ff", r: 4 }}
                    activeDot={{ fill: "#a8d1ff", r: 6, stroke: "#ffffff", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Aylara göre iade edilen kitapların ortalama iade süresi (gün olarak)
            </div>
          </div>
        </div>

        {/* Bottom Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Books Table */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Book className="w-5 h-5 text-[#d4c1ff]" /> En Çok Ödünç Verilen Kitaplar
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-gray-500 text-left">
                    <th className="py-2 pr-4">#</th>
                    <th className="py-2 pr-4">Kitap</th>
                    <th className="py-2 pr-4">Yazar</th>
                    <th className="py-2 pr-4">Adet</th>
                    <th className="py-2">Puan</th>
                  </tr>
                </thead>
                <tbody>
                  {popularBooks.map((book, i) => (
                    <tr key={book.title} className="border-t">
                      <td className="py-2 pr-4 font-bold">{i + 1}</td>
                      <td className="py-2 pr-4">{book.title}</td>
                      <td className="py-2 pr-4">{book.author}</td>
                      <td className="py-2 pr-4">{book.count}</td>
                      <td className="py-2 flex items-center gap-1">
                        <Star className="w-3 h-3 text-[#ffe0a3]" /> {book.rating}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Top Users Table */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#a5ecc9]" /> En Aktif Kullanıcılar
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-gray-500 text-left">
                    <th className="py-2 pr-4">#</th>
                    <th className="py-2 pr-4">Kullanıcı</th>
                    <th className="py-2 pr-4">Kitap</th>
                    <th className="py-2">Puan</th>
                  </tr>
                </thead>
                <tbody>
                  {activeUsers.map((user, i) => (
                    <tr key={user.name} className="border-t">
                      <td className="py-2 pr-4 font-bold">{i + 1}</td>
                      <td className="py-2 pr-4">{user.name}</td>
                      <td className="py-2 pr-4">{user.count}</td>
                      <td className="py-2 flex items-center gap-1">
                        <Star className="w-3 h-3 text-[#ffe0a3]" /> {user.rating}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
