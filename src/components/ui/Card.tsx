export function Card({ imageUrl, title, subtitle, children, onClick, className }: { imageUrl?: string, title?: string, subtitle?: string, children?: React.ReactNode, onClick?: ()=>void, className?: string }) {
  return (
    <div className={`overflow-hidden rounded-lg border bg-white shadow-sm ${className || ''}`} onClick={onClick}>
      {imageUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img src={imageUrl} alt={title || ''} className="h-full w-full object-cover" />
        </div>
      )}
      <div className="p-4">
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        {children && <div className="mt-3">{children}</div>}
      </div>
    </div>
  );
}
