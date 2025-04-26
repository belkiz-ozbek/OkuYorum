import { motion } from "framer-motion"

export const DiscoverContent = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Örnek kartlar - gerçek veri geldiğinde bu kısım değişecek */}
      {[1, 2, 3, 4, 5, 6].map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group relative"
        >
          {/* Kart arka planı */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/30 dark:to-purple-950/50 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300"></div>
          
          {/* Kart içeriği */}
          <div className="relative p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-300 font-medium">U</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Kullanıcı Adı</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">2 saat önce</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <button className="flex items-center gap-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400"></span>
                  </span>
                  <span>42</span>
                </button>
                
                <button className="flex items-center gap-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400"></span>
                  </span>
                  <span>8</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Hover efekti */}
          <div className="absolute inset-0 rounded-2xl border-2 border-purple-200/50 dark:border-purple-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </motion.div>
      ))}
    </div>
  )
}

export default DiscoverContent 