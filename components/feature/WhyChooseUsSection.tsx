import { useTranslations } from "next-intl";
import { ImQuotesRight } from "react-icons/im";


export default function WhyChooseUsContent() {
  const t = useTranslations('why_choose_us');

  const items = [
    {
      id: 1,
      title: t('reasons.0.title'),
      description: t('reasons.0.description'),
    },
    {
      id: 2,
      title: t('reasons.1.title'),
      description: t('reasons.1.description'),
    },
    {
      id: 3,
      title: t('reasons.2.title'),
      description: t('reasons.2.description'),
    },
    {
      id: 4,
      title: t('reasons.3.title'),
      description: t('reasons.3.description'),
    },
    {
      id: 5,
      title: t('reasons.4.title'),
      description: t('reasons.4.description'),
    },
    {
      id: 6,
      title: t('reasons.5.title'),
      description: t('reasons.5.description'),
    },
  ];

  return (
    <section
      className="relative mt-10 lg:mt-40 w-full px-3 lg:px-0"
      aria-labelledby="why-choose-us-title"
    >
      <div className="flex flex-col items-center justify-center gap-5 ">
        <header className="max-w-5xl text-center space-y-2 lg:space-y-5 px-5 lg:px-0">
          <h2
            id="why-choose-us-title"
            className="text-2xl lg:text-5xl 2xl:text-6xl text-primary font-bold tracking-wide"
          >
            {t('title')}
          </h2>
          <p className="text-sm lg:text-lg leading-5 lg:leading-tight font-medium">
            {t('description')}
          </p>
        </header>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-10 lg:mt-32">
        {items.map((item) => (
          <article
            key={item.id}
            className="relative bg-white rounded-[25px] lg:rounded-[50px] p-8 lg:p-10 space-y-5 lg:space-y-8"
            aria-labelledby={`reason-title-${item.id}`}
          >
            <h3
              id={`reason-title-${item.id}`}
              className="text-lg lg:text-2xl tracking-wide text-primary"
            >
              {item.title}
            </h3>
            <p className="text-sm xl:text-base font-medium whitespace-pre-line">
              {item.description}
            </p>
            <div className="absolute top-5 lg:top-0 right-5 lg:right-10 pointer-events-none" aria-hidden="true">
              <ImQuotesRight size={100} className="text-primary opacity-5" />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}