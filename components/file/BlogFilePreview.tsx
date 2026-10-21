"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@heroui/react";
import { FaRegFilePdf, FaRegFileImage, FaRegFileWord, FaRegFileExcel, FaRegFile } from "react-icons/fa6";
import { FiDownload, FiExternalLink } from "react-icons/fi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import type { BlogFile } from "@/types/blog";

type FileKind = NonNullable<BlogFile["type"]>;

const resolveKind = (file: BlogFile): FileKind => {
  if (file.type) return file.type;
  const ext = file.url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (["png", "jpg", "jpeg", "webp", "gif", "avif", "svg"].includes(ext)) return "image";
  if (["doc", "docx", "rtf", "txt"].includes(ext)) return "doc";
  if (["xls", "xlsx", "csv"].includes(ext)) return "sheet";
  return "other";
};

const ICONS: Record<FileKind, React.ElementType> = {
  pdf: FaRegFilePdf,
  image: FaRegFileImage,
  doc: FaRegFileWord,
  sheet: FaRegFileExcel,
  other: FaRegFile,
};

function FileCard({ file }: { file: BlogFile }) {
  const kind = resolveKind(file);
  const canPreview = kind === "pdf" || kind === "image";
  const [open, setOpen] = useState(false);
  const Icon = ICONS[kind];

  return (
    <div className="border border-primary/10 rounded-2xl overflow-hidden bg-primary/[0.03]">
      <div className="flex items-start gap-4 p-4 sm:p-5">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon size={20} className="text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-primary leading-snug break-words">{file.name}</p>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs font-medium text-primary/50">
            <span className="uppercase">{kind === "other" ? "File" : kind}</span>
            {file.size && (
              <>
                <span className="w-px h-3 bg-primary/15" />
                <span>{file.size}</span>
              </>
            )}
          </div>
          {file.description && (
            <p className="text-sm text-primary/70 mt-2 leading-relaxed">{file.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-4">
            {canPreview && (
              <Button
                size="sm"
                variant="flat"
                color="primary"
                className="font-semibold rounded-lg"
                onPress={() => setOpen((v) => !v)}
                endContent={
                  <MdOutlineKeyboardArrowDown
                    size={16}
                    className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                  />
                }
              >
                {open ? "Hide preview" : "Preview"}
              </Button>
            )}
            <Button
              as="a"
              href={file.url}
              download
              size="sm"
              color="primary"
              className="font-semibold rounded-lg text-white"
              startContent={<FiDownload size={15} />}
            >
              Download
            </Button>
            <Button
              as="a"
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              variant="light"
              className="font-semibold rounded-lg text-primary"
              startContent={<FiExternalLink size={15} />}
            >
              Open
            </Button>
          </div>
        </div>
      </div>

      {canPreview && open && (
        <div className="border-t border-primary/10 bg-white p-3 sm:p-4">
          {kind === "pdf" ? (
            <object
              data={`${file.url}#view=FitH`}
              type="application/pdf"
              className="w-full h-[70vh] min-h-[420px] rounded-xl"
              aria-label={`Preview of ${file.name}`}
            >
              <div className="p-6 text-center text-sm text-primary/70">
                Your browser can&apos;t display this PDF inline.{" "}
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-success font-semibold underline">
                  Open it in a new tab
                </a>
                .
              </div>
            </object>
          ) : (
            <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-primary/5">
              <Image src={file.url} alt={file.name} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-contain" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BlogFilePreview({
  files,
  title = "Documents & Downloads",
}: {
  files?: BlogFile[];
  title?: string;
}) {
  if (!files || files.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-primary/10">
      <h2 className="text-2xl lg:text-3xl font-mono font-normal tracking-wide text-primary mb-5">{title}</h2>
      <div className="space-y-4">
        {files.map((file) => (
          <FileCard key={file.url} file={file} />
        ))}
      </div>
    </section>
  );
}
