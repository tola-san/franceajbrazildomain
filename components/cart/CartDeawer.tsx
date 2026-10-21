'use client'

import { useCart } from '@/context/cart/cart-context'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button
} from "@heroui/react";
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FiMinus, FiPlus } from "react-icons/fi";
import { StepperButton } from '../button/StepperButton';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/utils/route';
import CartEmpty from '../ui/cart/cart-empty';
import { useTranslations } from 'next-intl';
import { FALLBACK_VARIATION_SUMMARY } from '@/lib/products/variation';


const CartDrawer = () => {
  const t = useTranslations('cart')
  const { state, dispatch, isOpen, toggleDrawer } = useCart()
  const router = useRouter()
  const handleNavigation = () => {
    router.push(ROUTES.QUOTATIONS);
  }

  return (
    <>
      <Drawer
        hideCloseButton
        size='xl'
        classNames={{
          base: "data-[placement=right]:sm:mr-8 data-[placement=right]:sm:my-3 data-[placement=left]:sm:m-2 rounded-none  sm:rounded-3xl  lg:rounded-[30px]",
        }}
        isOpen={isOpen}
        motionProps={{
          variants: {
            enter: {
              opacity: 1,
              x: 0,
              transition: {
                duration: 0.3,
              },
            },
            exit: {
              x: 100,
              opacity: 0,
              transition: {
                duration: 0.3,
              },
            },
          },
        }}
        onOpenChange={toggleDrawer}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader >
                <div className="flex justify-between items-center gap-1 w-full mt-2 z-[9999]">
                  <h3 className='font-mono text-2xl lg:text-4xl text-primary font-normal tracking-wide'>{t('item_for_quotation')}</h3>

                  <Button size="sm" className='bg-primary/20 hover:!bg-primary group transition-all duration-300' isIconOnly aria-label="close" radius="full" variant="light"
                    onPress={toggleDrawer}>
                    <IoClose size={20} className="text-primary group-hover:text-white transition-all duration-300" />
                  </Button>
                </div>

              </DrawerHeader>
              <DrawerBody className='pt-5'>
                {state.items.length === 0 ? (
                  <CartEmpty size={250} />

                ) : (
                  state.items.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex !transition-all !duration-300 items-center justify-between py-3 lg:py-5 ${idx !== state.items.length - 1 ? 'border-b' : ''}`}>
                      <div className='flex flex-col'>
                        <div className='flex items-center gap-5'>
                          <div className='relative overflow-hidden rounded-3xl h-24 min-w-24 lg:h-32 lg:min-w-32 select-none'>
                            <Image
                              src={item.image || ''}
                              alt={item.name}
                              fill
                              quality={50}
                              className='object-cover' />
                            <div className="absolute inset-0 bg-black/5" />
                          </div>
                          <div className='flex flex-col'>
                            <div className='mb-3 lg:mb-5 lg:space-y-1'>
                              <h2 className="font-medium text-lg lg:text-xl text-primary tracking-wide">{item.name}</h2>
                              <p className="text-sm font-semibold text-gray-500">{t('unit')}: {item.variation?.summary || FALLBACK_VARIATION_SUMMARY}</p>
                            </div>

                            <div className="flex items-center gap-1 lg:mt-1">
                              <StepperButton
                                size='xs'
                                color='default'
                                aria-label="close"
                                radius="full"
                                isDisabled={item.quantity === 1}
                                onPress={() => {
                                  dispatch({
                                    type: 'UPDATE_QUANTITY',
                                    payload: { id: item.id, quantity: Math.max(item.quantity - 1, 1) },
                                  })
                                }}>
                                <FiMinus className="text-primary" />
                              </StepperButton>
                              <span className="px-2 select-none min-w-10 text-center font-mono text-xl text-primary font-normal">{item.quantity}</span>
                              <StepperButton isDisabled={item.quantity === 100} size="xs" isIconOnly color='default' aria-label="close" radius="full"
                                onPress={() => {
                                  dispatch({
                                    type: 'UPDATE_QUANTITY',
                                    payload: { id: item.id, quantity: item.quantity + 1 },
                                  })
                                }}>
                                <FiPlus className="text-primary" />
                              </StepperButton>
                            </div>
                          </div>

                        </div>

                      </div>
                      <button
                        onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })}
                        className="text-red-500 mt-3">
                        <RiDeleteBin6Line size={18} />
                      </button>
                    </div>
                  ))
                )}

              </DrawerBody>

              <DrawerFooter>
                {!state.isEmpty && (
                  <div className='flex justify-between items-center w-full gap-5 mb-2'>
                    <Button color="primary" size='lg' className='w-full text-white font-mono !font-normal tracking-wider' onPress={() => {
                      toggleDrawer()
                      handleNavigation()
                    }}>
                      {t('request_quotation')}
                    </Button>
                  </div>
                )}

              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );

}

export default CartDrawer
