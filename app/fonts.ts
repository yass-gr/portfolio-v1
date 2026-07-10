import localFont from 'next/font/local'

export const exposeRegular = localFont({
  src: '../public/Expose_Complete/Fonts/WEB/fonts/Expose-Regular.woff2',
  weight: '400',
  variable: '--font-expose-regular',
  display: 'swap',
})

export const exposeBold = localFont({
  src: '../public/Expose_Complete/Fonts/WEB/fonts/Expose-Bold.woff2',
  weight: '700',
  variable: '--font-expose-bold',
  display: 'swap',
})

export const exposeBlack = localFont({
  src: '../public/Expose_Complete/Fonts/WEB/fonts/Expose-Black.woff2',
  weight: '900',
  variable: '--font-expose-black',
  display: 'swap',
})
