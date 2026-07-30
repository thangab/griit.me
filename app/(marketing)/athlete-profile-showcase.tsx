import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@phosphor-icons/react/ssr';
import amaraPulse from './profile-screenshots/amara-pulse.png';
import diegoEvergreen from './profile-screenshots/diego-evergreen.png';
import hanaHorizon from './profile-screenshots/hana-horizon.png';
import leaObsidian from './profile-screenshots/lea-obsidian.png';
import malikImpact from './profile-screenshots/malik-impact.png';
import mayaSpotlight from './profile-screenshots/maya-spotlight.png';
import noahMidnight from './profile-screenshots/noah-midnight.png';
import sofiaMomentum from './profile-screenshots/sofia-momentum.png';
import styles from './hero-profile-collage.module.css';

type ProfileScreenshot = {
  image: StaticImageData;
  name: string;
  sport: string;
  template: string;
  pro?: boolean;
};

const heroProfiles = {
  maya: {
    image: mayaSpotlight,
    name: 'Maya Chen',
    sport: 'Running',
    template: 'Spotlight',
  },
  malik: {
    image: malikImpact,
    name: 'Malik Johnson',
    sport: 'Boxing',
    template: 'Impact',
    pro: true,
  },
  sofia: {
    image: sofiaMomentum,
    name: 'Sofia Almeida',
    sport: 'Cycling',
    template: 'Momentum',
  },
} satisfies Record<string, ProfileScreenshot>;

const templateProfiles = [
  {
    image: mayaSpotlight,
    name: 'Maya Chen',
    sport: 'Running',
    template: 'Spotlight',
  },
  {
    image: sofiaMomentum,
    name: 'Sofia Almeida',
    sport: 'Cycling',
    template: 'Momentum',
  },
  {
    image: malikImpact,
    name: 'Malik Johnson',
    sport: 'Boxing',
    template: 'Impact',
    pro: true,
  },
  {
    image: leaObsidian,
    name: 'Léa Martin',
    sport: 'Swimming',
    template: 'Obsidian',
    pro: true,
  },
  {
    image: noahMidnight,
    name: 'Noah Williams',
    sport: 'Climbing',
    template: 'Midnight',
  },
  {
    image: amaraPulse,
    name: 'Amara Okafor',
    sport: 'Football',
    template: 'Pulse',
    pro: true,
  },
  {
    image: diegoEvergreen,
    name: 'Diego Santos',
    sport: 'Basketball',
    template: 'Evergreen',
  },
  {
    image: hanaHorizon,
    name: 'Hana Kim',
    sport: 'Surfing',
    template: 'Horizon',
    pro: true,
  },
] satisfies ProfileScreenshot[];

function ProfileCrop({
  className,
  profile,
  priority = false,
  slot,
  sizes,
}: {
  className: string;
  profile: ProfileScreenshot;
  priority?: boolean;
  slot: 'left' | 'center' | 'right';
  sizes: string;
}) {
  return (
    <div className={`${styles.profile} ${className}`} data-profile={slot}>
      <div className={styles.motion}>
        <figure className={styles.card} tabIndex={0}>
          <Image
            alt={`${profile.name}'s ${profile.sport.toLowerCase()} profile built with the ${profile.template} template`}
            className={styles.image}
            fill
            placeholder="blur"
            priority={priority}
            quality={88}
            sizes={sizes}
            src={profile.image}
          />
          <span className={styles.shine} />
          <figcaption
            className={`${styles.caption} absolute right-3 bottom-3 left-3 z-10 flex items-center justify-between gap-2 rounded-full border border-white/15 bg-[#151515]/88 px-3 py-2 text-white shadow-lg backdrop-blur-md`}
          >
            <span className="min-w-0">
              <span className="block truncate text-[10px] font-black">
                {profile.name}
              </span>
              <span className="block truncate text-[8px] font-semibold text-white/55">
                {profile.sport}
              </span>
            </span>
            <ArrowRightIcon className="h-3.5 w-3.5 shrink-0" weight="bold" />
          </figcaption>
        </figure>
      </div>
    </div>
  );
}

export function HeroProfileCollage() {
  return (
    <div
      className={`${styles.collage} relative mx-auto h-[540px] w-full max-w-[620px] sm:h-[620px] lg:h-[650px]`}
    >
      <div className="absolute top-8 left-1/2 h-[82%] w-[64%] -translate-x-1/2 rounded-full bg-[#3157ff]/12 blur-3xl" />

      <ProfileCrop
        className="top-6 left-1/2 z-20 h-[510px] w-[242px] -translate-x-1/2 sm:top-4 sm:h-[590px] sm:w-[280px] lg:h-[620px] lg:w-[294px]"
        priority
        profile={heroProfiles.malik}
        slot="center"
        sizes="(min-width: 1024px) 294px, (min-width: 640px) 280px, 242px"
      />
      <ProfileCrop
        className="top-16 left-2 z-10 hidden h-[505px] w-[238px] sm:block lg:left-0 lg:h-[535px] lg:w-[252px]"
        profile={heroProfiles.sofia}
        slot="left"
        sizes="(min-width: 1024px) 252px, 238px"
      />
      <ProfileCrop
        className="top-16 right-2 z-10 hidden h-[505px] w-[238px] sm:block lg:right-0 lg:h-[535px] lg:w-[252px]"
        profile={heroProfiles.maya}
        slot="right"
        sizes="(min-width: 1024px) 252px, 238px"
      />
    </div>
  );
}

const inspirationProfiles = [
  templateProfiles[3],
  templateProfiles[5],
  templateProfiles[7],
];

export function InspirationProfileGallery() {
  return (
    <div className="-mx-5 mt-14 flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto px-5 pt-2 pb-8 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
      {inspirationProfiles.map((profile, index) => (
        <Link
          className={`group w-[82vw] max-w-[340px] shrink-0 snap-center rounded-[2rem] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#3157ff] sm:w-auto sm:max-w-none ${
            index === 1 ? 'sm:translate-y-8' : ''
          }`}
          href="/inspiration"
          key={profile.name}
        >
          <article className="rounded-[2rem] border border-black/10 bg-white p-2.5 shadow-[0_18px_45px_rgba(20,20,20,0.1)] transition duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_28px_65px_rgba(20,20,20,0.18)]">
            <div className="flex h-10 items-center gap-2 px-2">
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="h-2 w-2 rounded-full bg-[#ff6b61]" />
                <span className="h-2 w-2 rounded-full bg-[#ffc64c]" />
                <span className="h-2 w-2 rounded-full bg-[#45c86b]" />
              </span>
              <span className="min-w-0 flex-1 truncate rounded-full bg-[#f3f3ef] px-3 py-1.5 text-center text-[9px] font-bold text-black/40">
                griit.me/{profile.name.toLowerCase().replaceAll(' ', '-')}
              </span>
            </div>
            <div className="relative aspect-[9/12] overflow-hidden rounded-[1.45rem] bg-[#151515]">
              <Image
                alt={`${profile.name}'s public athlete profile`}
                className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.025]"
                fill
                placeholder="blur"
                quality={86}
                sizes="(min-width: 1280px) 390px, (min-width: 640px) 31vw, 82vw"
                src={profile.image}
              />
            </div>
            <div className="flex items-center justify-between gap-3 px-2 pt-4 pb-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-black">{profile.name}</p>
                <p className="mt-1 truncate text-[10px] font-bold text-black/42">
                  {profile.sport} · {profile.template}
                </p>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#151515] text-white transition-transform group-hover:rotate-6">
                <ArrowRightIcon className="h-4 w-4" weight="bold" />
              </span>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
