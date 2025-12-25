# EV Charging Calculator

A modern web application to calculate the cost of charging your electric vehicle.

## Features

- **Vehicle Selection**: Choose from a wide range of popular EV models with their battery capacities
- **Charging Price Input**: Enter the charging price in EUR/kWh
- **Battery Level Selection**: Set start and end battery percentages using intuitive sliders
- **Real-time Calculation**: Instantly see the energy required and total cost

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## How It Works

The calculator uses the following formula:
- **Energy Required (kWh)** = Battery Capacity × (End % - Start %) / 100
- **Total Cost (EUR)** = Energy Required × Charging Price

## Technologies

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Modern UI with dark mode support

