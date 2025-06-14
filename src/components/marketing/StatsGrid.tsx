interface Stat {
  value: string
  label: string
}

interface StatsGridProps {
  stats: Stat[]
  columns?: 2 | 3 | 4
  className?: string
}

export function StatsGrid({ stats, columns = 3, className = '' }: StatsGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-4'
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-8 ${className}`}>
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">{stat.value}</div>
          <div className="text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}