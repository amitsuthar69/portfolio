
import type { ImageProps } from 'next/image'
import Image from 'next/image'
import { twclsx } from '../../libs/twclsx'

type WrappedImageProps = ImageProps & {
  alt: string
  parentStyle?: string
}



export const WrappedImage: React.FunctionComponent<WrappedImageProps> = ({ parentStyle, ...props }) => {
  if (!props.fill) {
    return <Image {...props} />
  }

  return (
    <figure className={twclsx('relative', parentStyle)}>
      <Image {...props} placeholder='blur' blurDataURL='/blur.svg' sizes='(max-width: 768px) 100%' />
    </figure>
  )
}