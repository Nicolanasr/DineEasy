interface SectionHeaderProps {
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
}

export function SectionHeader({ 
  title, 
  subtitle, 
  centered = true, 
  className = '' 
}: SectionHeaderProps) {
  const alignmentClass = centered ? 'text-center' : 'text-left'
  
  return (
    <div className={`${alignmentClass} mb-16 ${className}`}>
      <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
      {subtitle && (
        <p className="text-xl text-gray-600">{subtitle}</p>
      )}
    </div>
  )
}