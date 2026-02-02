import { LoaderCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const SpinnerLoader = ({ className }: { className?: string }) => {
  return (
    <LoaderCircle className={cn("animate-spin w-4 h-4 md:w-5 md:h-5", className)} />
  )
}

export default SpinnerLoader