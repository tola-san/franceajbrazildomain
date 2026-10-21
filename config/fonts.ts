import { Bricolage_Grotesque, Bungee, Epilogue, Rubik } from 'next/font/google'
import localFont from 'next/font/local'

export const fontBungee = Bungee({
     variable: '--font-bungee',
     subsets: ['latin'],
     weight: '400',
})

export const fontEpilogue = Epilogue({
     variable: '--font-epilogue',
     subsets: ['latin'],
})

export const fontBricolageGrotesque = Bricolage_Grotesque({
     subsets: ['latin'],
     variable: '--font-bricolage-grotesque',
})
export const fontRubik = Rubik({
     subsets: ['latin'],
     variable: '--font-rubik',
})

export const fontFlame = localFont({
     src: [
          {
               path: '../public/fonts/Flame-Regular.otf',
               weight: '400',
               style: 'normal',
          },
          {
               path: '../public/fonts/Flame-Bold.otf',
               weight: '700',
               style: 'normal',
          },
     ],
     display: 'swap',
     variable: '--font-flame',
})
