import { LoaderCircle } from 'lucide-react'

const SpinnerLoader = ({ className }: { className?: string }) => {
  return (
    <LoaderCircle className={className + " animate-spin w-4 h-4 md:w-5 md:h-5"} />
  )
}

export default SpinnerLoader