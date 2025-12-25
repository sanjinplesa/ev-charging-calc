'use client'

import { useState, useMemo } from 'react'
import vehiclesData from '@/data/vehicles.json'

interface Vehicle {
  id: string
  name: string
  batteryCapacity: number
}

export default function Home() {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('')
  const [chargingPrice, setChargingPrice] = useState<string>('')
  const [startBattery, setStartBattery] = useState<number>(20)
  const [endBattery, setEndBattery] = useState<number>(80)

  const selectedVehicle = useMemo(() => {
    return vehiclesData.find((v: Vehicle) => v.id === selectedVehicleId)
  }, [selectedVehicleId])

  const calculateCost = () => {
    if (!selectedVehicle || !chargingPrice) return null

    const price = parseFloat(chargingPrice)
    if (isNaN(price) || price < 0) return null

    if (endBattery <= startBattery) return null

    const batteryPercentage = (endBattery - startBattery) / 100
    const energyRequired = selectedVehicle.batteryCapacity * batteryPercentage
    const totalCost = energyRequired * price

    return {
      energyRequired: energyRequired.toFixed(2),
      totalCost: totalCost.toFixed(2),
    }
  }

  const result = calculateCost()

  return (
    <main className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Plugrate
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Calculate your EV charging costs instantly
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8 md:p-10">
          <div className="space-y-8">
            {/* Vehicle Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Select Vehicle
              </label>
              <div className="relative">
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none cursor-pointer hover:border-blue-400 dark:hover:border-blue-500"
                >
                  <option value="">Choose a vehicle...</option>
                  {vehiclesData.map((vehicle: Vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.name} ({vehicle.batteryCapacity} kWh)
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {selectedVehicle && (
                <div className="flex items-center gap-2 mt-3 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                    Battery Capacity: <span className="font-bold">{selectedVehicle.batteryCapacity} kWh</span>
                  </p>
                </div>
              )}
            </div>

            {/* Charging Price */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Charging Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">€</span>
                </div>
                <input
                  type="number"
                  value={chargingPrice}
                  onChange={(e) => setChargingPrice(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full pl-8 pr-5 py-4 bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-400 dark:hover:border-blue-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
                  <span className="text-slate-400 dark:text-slate-500 text-sm font-medium">/kWh</span>
                </div>
              </div>
            </div>

            {/* Battery Percentage Range */}
            <div className="space-y-6 pt-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                      Start Battery Level
                    </label>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {startBattery}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={startBattery}
                    onChange={(e) => {
                      const value = parseInt(e.target.value)
                      setStartBattery(value)
                      if (value >= endBattery) {
                        setEndBattery(Math.min(100, value + 1))
                      }
                    }}
                    className="w-full h-3 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, rgb(99, 102, 241) 0%, rgb(99, 102, 241) ${startBattery}%, rgb(226, 232, 240) ${startBattery}%, rgb(226, 232, 240) 100%)`
                    }}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                      End Battery Level
                    </label>
                    <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {endBattery}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={endBattery}
                    onChange={(e) => {
                      const value = parseInt(e.target.value)
                      setEndBattery(value)
                      if (value <= startBattery) {
                        setStartBattery(Math.max(0, value - 1))
                      }
                    }}
                    className="w-full h-3 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, rgb(99, 102, 241) 0%, rgb(99, 102, 241) ${endBattery}%, rgb(226, 232, 240) ${endBattery}%, rgb(226, 232, 240) 100%)`
                    }}
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-sm font-semibold text-blue-900 dark:text-blue-200 uppercase tracking-wide">Charging Range</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{endBattery - startBattery}%</span>
                </div>
              </div>
            </div>

            {/* Result */}
            {result && (
              <div className="mt-8 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/20 dark:via-green-900/20 dark:to-teal-900/20 border-2 border-emerald-300 dark:border-emerald-700 rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    Charging Cost Calculation
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Energy Required</span>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                      {result.energyRequired} <span className="text-sm text-slate-500">kWh</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl shadow-lg">
                    <span className="text-white font-semibold text-lg">Total Cost</span>
                    <span className="text-4xl font-bold text-white">
                      €{result.totalCost}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {selectedVehicle && chargingPrice && !result && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-xl p-5">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Please ensure end battery level is greater than start battery level.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

