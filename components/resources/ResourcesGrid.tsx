'use client';

import { useEffect, useState } from 'react';
import { Button } from '@heroui/button';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaRegFilePdf } from 'react-icons/fa6';
import { FiDownload, FiExternalLink } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { ResourceFile } from '@/lib/resources';

interface Props {
    resources: ResourceFile[];
}

/**
 * Cards for every PDF in public/pdf. Selecting one opens it in a preview
 * dialog — the browser's own PDF viewer inside an iframe — with a download
 * button alongside. The open document is mirrored in the `doc` query param so
 * the navbar can link straight to a preview and the URL stays shareable.
 */
export default function ResourcesGrid({ resources }: Props) {
    const t = useTranslations('resources_page');
    const router = useRouter();
    const searchParams = useSearchParams();
    const requestedSlug = searchParams.get('doc');

    const [active, setActive] = useState<ResourceFile | null>(null);

    // Open whatever `?doc=` names, including when the navbar links here while
    // the page is already mounted.
    useEffect(() => {
        setActive(resources.find((resource) => resource.slug === requestedSlug) ?? null);
    }, [requestedSlug, resources]);

    const openResource = (resource: ResourceFile) => {
        setActive(resource);
        router.replace(`?doc=${resource.slug}`, { scroll: false });
    };

    const closePreview = () => {
        setActive(null);
        router.replace('?', { scroll: false });
    };

    if (resources.length === 0) {
        return (
            <p className="rounded-[30px] border border-primary/15 bg-white p-10 text-center text-primary/70">
                {t('empty')}
            </p>
        );
    }

    return (
        <>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {resources.map((resource) => (
                    <li key={resource.slug} id={resource.slug}>
                        <article className="flex h-full flex-col rounded-[30px] bg-white p-6 lg:p-8">
                            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                                <FaRegFilePdf size={26} className="text-primary" />
                            </span>

                            <h2 className="mt-5 text-lg lg:text-xl text-primary text-balance">
                                {resource.title}
                            </h2>
                            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-primary/50">
                                PDF · {resource.size}
                            </p>

                            <div className="mt-6 flex flex-wrap items-center gap-2 pt-2 mt-auto">
                                <Button
                                    color="primary"
                                    radius="lg"
                                    className="font-mono tracking-wider text-white"
                                    startContent={<FiExternalLink size={18} />}
                                    onPress={() => openResource(resource)}>
                                    {t('preview')}
                                </Button>
                                <Button
                                    as="a"
                                    href={resource.url}
                                    download={resource.fileName}
                                    color="primary"
                                    variant="bordered"
                                    radius="lg"
                                    className="font-mono tracking-wider"
                                    startContent={<FiDownload size={18} />}>
                                    {t('download')}
                                </Button>
                            </div>
                        </article>
                    </li>
                ))}
            </ul>

            <Modal
                size="5xl"
                hideCloseButton
                isOpen={Boolean(active)}
                scrollBehavior="inside"
                classNames={{ base: 'rounded-[30px]' }}
                onOpenChange={(isOpen) => !isOpen && closePreview()}>
                <ModalContent>
                    <ModalHeader className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h2 className="truncate text-lg lg:text-2xl text-primary">{active?.title}</h2>
                            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-primary/50">
                                PDF · {active?.size}
                            </p>
                        </div>
                        <Button
                            isIconOnly
                            size="sm"
                            radius="full"
                            variant="light"
                            aria-label={t('close')}
                            className="bg-primary/10"
                            onPress={closePreview}>
                            <IoClose size={20} className="text-primary" />
                        </Button>
                    </ModalHeader>

                    <ModalBody className="px-3 pb-3 lg:px-6">
                        {active && (
                            <iframe
                                key={active.slug}
                                src={active.url}
                                title={active.title}
                                className="h-[70vh] w-full rounded-2xl border border-primary/10 bg-default-100"
                            />
                        )}
                    </ModalBody>

                    <ModalFooter className="flex-wrap gap-2">
                        <Button
                            as="a"
                            href={active?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="bordered"
                            color="primary"
                            radius="lg"
                            className="font-mono tracking-wider"
                            startContent={<FiExternalLink size={18} />}>
                            {t('open_new_tab')}
                        </Button>
                        <Button
                            as="a"
                            href={active?.url}
                            download={active?.fileName}
                            color="primary"
                            radius="lg"
                            className="font-mono tracking-wider text-white"
                            startContent={<FiDownload size={18} />}>
                            {t('download')}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
