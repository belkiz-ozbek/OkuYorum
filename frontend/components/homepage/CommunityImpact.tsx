"use client"
import React from "react"

export function CommunityImpact() {
  return (
    <div className="bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 my-16">
      <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-br from-purple-700 to-purple-900 dark:from-purple-400 dark:to-purple-600">
        Toplum Üzerindeki Etkimiz
      </h2>
      <div className="grid md:grid-cols-3 gap-8 text-center">
        <div>
          <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600">
            5,000+
          </p>
          <p className="text-gray-600 dark:text-gray-300">Bağışlanan Kitap</p>
        </div>
        <div>
          <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600">
            10,000+
          </p>
          <p className="text-gray-600 dark:text-gray-300">Aktif Kullanıcı</p>
        </div>
        <div>
          <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600">
            500+
          </p>
          <p className="text-gray-600 dark:text-gray-300">Haftalık Tartışma</p>
        </div>
      </div>
    </div>
  )
}
