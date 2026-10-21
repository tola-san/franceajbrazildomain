'use client';

import { useUI } from '@/context/ui-context';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, User } from '@heroui/react';
import { IoClose } from 'react-icons/io5';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import Image from 'next/image';

const GetQuotationModal: React.FC = () => {
    const { isGetQuotationOpen, getQuotationData, closeGetQuotation } = useUI();
    if (!isGetQuotationOpen || !getQuotationData) return null;
    console.table(getQuotationData);
    const { name, images, description, category } = getQuotationData;
    return (
        <Modal
            className='rounded-[30px] lg:rounded-[50px] min-h-[700px] py-5 px-5 max-w-7xl'
            isDismissable
            isKeyboardDismissDisabled={true}
            isOpen={isGetQuotationOpen}
            onOpenChange={(isOpen) => {
                if (!isOpen) closeGetQuotation();
            }} hideCloseButton>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className='flex justify-between'>
                            <h1 className='text-2xl lg:text-4xl font-normal text-primary'>Request Wholesale Prices</h1>
                            <Button size="sm" className='bg-primary/20 hover:!bg-primary group transition-all duration-300' isIconOnly aria-label="close" radius="full" variant="light"
                                onPress={() => {
                                    closeGetQuotation();
                                    onClose();
                                }}>
                                <IoClose size={20} className="text-primary group-hover:text-white transition-all duration-300" />
                            </Button>
                        </ModalHeader>
                        <ModalBody>
                            <div className='mt-10'>
                                <Table removeWrapper aria-label="Example static collection table">
                                    <TableHeader>
                                        <TableColumn>IMAGE</TableColumn>
                                        <TableColumn>PRODUCT NAME</TableColumn>
                                        <TableColumn>SELLING UNIT</TableColumn>
                                        <TableColumn>QUALITY</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow key="1">
                                            <TableCell>
                                                <div className='relative overflow-hidden rounded-xl h-[100px] w-[100px] select-none'>
                                                    <Image
                                                        alt={name}
                                                        src={images?.[0] ?? "/images/placeholder-image.jpg"}
                                                        fill
                                                        quality={50}
                                                    />
                                                    <div className='absolute inset-0 bg-black/5' />
                                                </div>

                                            </TableCell>
                                            <TableCell>{name}</TableCell>
                                            <TableCell>24 ton / container</TableCell>
                                            <TableCell>Active</TableCell>
                                        </TableRow>

                                    </TableBody>
                                </Table>
                            </div>
                        </ModalBody>
                    </>

                )}
            </ModalContent>
        </Modal>
    );
};

export default GetQuotationModal;
