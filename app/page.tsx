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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            EV Charging Calculator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Calculate the cost of charging your electric vehicle
          </p>

          <div className="space-y-6">
            {/* Vehicle Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Vehicle
              </label>
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Choose a vehicle...</option>
                {vehiclesData.map((vehicle: Vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} ({vehicle.batteryCapacity} kWh)
                  </option>
                ))}
              </select>
              {selectedVehicle && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Battery Capacity: <span className="font-semibold">{selectedVehicle.batteryCapacity} kWh</span>
                </p>
              )}
            </div>

            {/* Charging Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Charging Price (EUR/kWh)
              </label>
              <input
                type="number"
                value={chargingPrice}
                onChange={(e) => setChargingPrice(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Battery Percentage Range */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Battery Level: <span className="font-semibold">{startBattery}%</span>
                </label>
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
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Battery Level: <span className="font-semibold">{endBattery}%</span>
                </label>
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
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Charging Range: <span className="font-semibold">{endBattery - startBattery}%</span>
                </p>
              </div>
            </div>

            {/* Result */}
            {result && (
              <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-600 rounded-lg p-6">
                <h2 className="text-xl font-bold text-green-900 dark:text-green-100 mb-4">
                  Charging Cost Calculation
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">Energy Required:</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {result.energyRequired} kWh
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-green-200 dark:border-green-800">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Cost:</span>
                    <span className="text-2xl font-bold text-green-700 dark:text-green-400">
                      €{result.totalCost}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {selectedVehicle && chargingPrice && !result && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Please ensure end battery level is greater than start battery level.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

