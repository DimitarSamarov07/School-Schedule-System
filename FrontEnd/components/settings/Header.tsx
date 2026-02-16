import {X} from "lucide-react";
import React from "react";



export default function Header({ closeAll}) {

  return (
          <div className="p-6 border-b border-slate-200/50 bg-white/50">
              <div className="flex items-center justify-between">
                  <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">Управление на администратори</h2>
                      <p className="text-slate-500 mt-1">Промотирайте или отнемете права на администратор</p>
                  </div>
                  <button onClick={closeAll} className="p-2 hover:bg-slate-200/50 rounded-2xl transition-all">
                      <X size={24} className="text-slate-500" />
                  </button>
              </div>
          </div>
  )
}