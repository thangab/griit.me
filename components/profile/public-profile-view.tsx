import { EventPosterTemplate } from '@/components/profile/templates/event-poster-template';
import {
  GoalSpotlightTemplate,
  type ProfileTemplateVariant,
} from '@/components/profile/templates/goal-spotlight-template';
import {
  isSportProfileTemplateId,
  SportProfileTemplate,
} from '@/components/profile/templates/sport-profile-template';
import { resolveProfileTemplateId } from '@/lib/constants/profile-templates';
import type { ProfileBuilderState } from '@/lib/types/profile-builder';

type PublicProfileViewProps = {
  builder: ProfileBuilderState;
  variant?: ProfileTemplateVariant;
};

export function PublicProfileView({
  builder,
  variant = 'full',
}: PublicProfileViewProps) {
  const templateId = resolveProfileTemplateId(builder.profile.theme);

  if (templateId === 'event_poster') {
    return <EventPosterTemplate builder={builder} variant={variant} />;
  }

  if (isSportProfileTemplateId(templateId)) {
    return (
      <SportProfileTemplate
        builder={builder}
        templateId={templateId}
        variant={variant}
      />
    );
  }

  return <GoalSpotlightTemplate builder={builder} variant={variant} />;
}
