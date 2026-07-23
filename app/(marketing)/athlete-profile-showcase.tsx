import Image, { type StaticImageData } from 'next/image';
import { ArrowRightIcon } from '@phosphor-icons/react/ssr';
import amaraPulse from './profile-screenshots/amara-pulse.png';
import diegoEvergreen from './profile-screenshots/diego-evergreen.png';
import hanaHorizon from './profile-screenshots/hana-horizon.png';
import leaObsidian from './profile-screenshots/lea-obsidian.png';
import malikImpact from './profile-screenshots/malik-impact.png';
import mayaSpotlight from './profile-screenshots/maya-spotlight.png';
import noahMidnight from './profile-screenshots/noah-midnight.png';
import sofiaMomentum from './profile-screenshots/sofia-momentum.png';

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
  sizes,
}: {
  className: string;
  profile: ProfileScreenshot;
  priority?: boolean;
  sizes: string;
}) {
  return (
    <figure
      className={`absolute overflow-hidden rounded-[2rem] border-[7px] border-[#151515] bg-[#151515] shadow-[0_28px_65px_rgba(18,18,18,0.24)] transition-[transform,opacity,filter,box-shadow] duration-500 ease-out hover:!z-50 hover:!scale-[1.06] hover:!rotate-0 hover:!opacity-100 hover:shadow-[0_38px_90px_rgba(18,18,18,0.34)] focus-visible:!z-50 focus-visible:!scale-[1.06] focus-visible:!rotate-0 focus-visible:!opacity-100 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#3157ff] ${className}`}
      tabIndex={0}
    >
      <Image
        alt={`${profile.name}'s ${profile.sport.toLowerCase()} profile built with the ${profile.template} template`}
        className="object-cover object-top"
        fill
        placeholder="blur"
        priority={priority}
        quality={88}
        sizes={sizes}
        src={profile.image}
      />
      <figcaption className="absolute right-3 bottom-3 left-3 flex items-center justify-between gap-2 rounded-full border border-white/15 bg-[#151515]/88 px-3 py-2 text-white shadow-lg backdrop-blur-md">
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
  );
}

export function HeroProfileCollage() {
  return (
    <div className="relative mx-auto h-[540px] w-full max-w-[620px] sm:h-[620px] lg:h-[650px] [&:has(figure:focus-visible)_figure]:opacity-60 [&:has(figure:focus-visible)_figure:focus-visible]:!opacity-100 [&:has(figure:hover)_figure]:opacity-60 [&:has(figure:hover)_figure:hover]:!opacity-100">
      <div className="absolute top-8 left-1/2 h-[82%] w-[64%] -translate-x-1/2 rounded-full bg-[#3157ff]/12 blur-3xl" />

      <ProfileCrop
        className="top-6 left-1/2 z-20 h-[510px] w-[242px] -translate-x-1/2 rotate-[1deg] sm:top-4 sm:h-[590px] sm:w-[280px] lg:h-[620px] lg:w-[294px]"
        priority
        profile={heroProfiles.malik}
        sizes="(min-width: 1024px) 294px, (min-width: 640px) 280px, 242px"
      />
      <ProfileCrop
        className="top-16 left-2 z-10 hidden h-[505px] w-[238px] -rotate-6 sm:block lg:left-0 lg:h-[535px] lg:w-[252px]"
        profile={heroProfiles.sofia}
        sizes="(min-width: 1024px) 252px, 238px"
      />
      <ProfileCrop
        className="top-16 right-2 z-10 hidden h-[505px] w-[238px] rotate-6 sm:block lg:right-0 lg:h-[535px] lg:w-[252px]"
        profile={heroProfiles.maya}
        sizes="(min-width: 1024px) 252px, 238px"
      />
    </div>
  );
}

export function TemplateProfileGallery() {
  return (
    <div className="-mx-5 mt-14 flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto px-5 pt-1 pb-5 [-ms-overflow-style:none] sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-x-5 sm:gap-y-8 sm:overflow-visible sm:px-0 sm:pt-0 sm:pb-0 lg:gap-x-7 lg:gap-y-12 [&::-webkit-scrollbar]:hidden">
      {templateProfiles.map((profile, index) => (
        <article
          className={`w-[78vw] max-w-[290px] shrink-0 snap-center sm:w-auto sm:max-w-none ${
            index % 2 === 1 ? 'sm:translate-y-8' : ''
          }`}
          key={profile.name}
        >
          <div className="group relative aspect-[9/14] overflow-hidden rounded-[1.6rem] border-[5px] border-[#151515] bg-[#151515] shadow-[0_18px_40px_rgba(20,20,20,0.16)]">
            <Image
              alt={`${profile.name}'s public athlete profile`}
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.025]"
              fill
              placeholder="blur"
              quality={86}
              sizes="(min-width: 1280px) 280px, (min-width: 640px) 22vw, 44vw"
              src={profile.image}
            />
          </div>
          <div className="mt-4 flex items-start justify-between gap-3 px-1">
            <div>
              <p className="text-sm font-black">{profile.name}</p>
              <p className="mt-1 text-[10px] font-bold text-black/42">
                {profile.sport} · {profile.template}
              </p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-[8px] font-black tracking-[0.12em] uppercase ${
                profile.pro
                  ? 'bg-[#151515] text-white'
                  : 'bg-[#e8edff] text-[#3157ff]'
              }`}
            >
              {profile.pro ? 'Pro' : 'Free'}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
