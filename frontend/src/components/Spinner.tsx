export function Spinner() {
  return (
    <div className="flex items-center justify-center py-14">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-(--color-border) border-t-cyan-600 dark:border-t-cyan-400" />
    </div>
  )
}
