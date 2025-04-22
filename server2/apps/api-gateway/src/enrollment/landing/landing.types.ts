import { LandingService } from 'apps/enrollment/src/landing/landing.service';

export type PartnerSchoolsReturn = Awaited<
  ReturnType<LandingService['getPartnerSchools']>
>;
export type AnnouncementsReturn = Awaited<
  ReturnType<LandingService['getAnnouncements']>
>;
