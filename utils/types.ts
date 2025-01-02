import { destinations } from "../prisma/data/index";
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  imageId: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
  media: MediaResponse;
}

export interface BespokeResponse {
  name: string;
  email: string;
  phoneNumber: string;
  tripDays: string;
  selectedCode: string;
  selectedDestination?: string;
  bespokeFormQuestionAndAnswer?: {
    answer?: string;
    additionalText?: string;
  }[];
}

export interface UserResponse {
  status: string;
  data: {
    user: AuthUser;
  };
}

export interface UserLoginResponse {
  status: string;
  token: string;
}

export interface PageResponse {
  id: number;
  name?: string;
  title?: string;
  description?: string;
  seoKeywords?: string;
  showInPages?: boolean;
  isExpandable: boolean;
  seoMeta: SeoMetaResponse;
  content: ContentResponse[];
}

export interface ContentResponse {
  id?: number;
  name?: string;
  title?: string;
  description?: string;
  subTitle?: string;
  buttonText?: string;
  buttonUrl?: string;
  referenceId?: number;
  media?: MediaResponse;
}

export interface MediaResponse {
  id?: number;
  desktopMediaUrl?: string | File;
  mobileMediaUrl?: string | File;
}

export interface PlanServicesResponse {
  id?: number;
  name: string;
  imageId?: number;
  isActive?: Boolean;
  media?: MediaResponse;
  planId?: Number;
}

export interface PartnersResponse {
  id?: number;
  name?: string;
  imageId?: number;
  isActive?: Boolean;
  sortId: number;
  media?: MediaResponse;
}

export interface DestinationFeaturesResponse {
  id?: number;
  name?: string;
  imageId?: number;
  isActive?: Boolean;
  media?: MediaResponse;
}
export interface BannerResponse {
  id?: number;
  name?: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonUrl?: string;
  isActive?: boolean;
  media?: MediaResponse;
  bannerId?: number;
}
export interface FaqResponse {
  id?: number;
  faqId?: number;
  question?: string;
  answer?: string;
  isActive?: boolean;
}

export interface FormResponse {
  id: number;
  name?: string;
  destination?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  message?: string;
  subject?: string;
  gReCaptchaToken?: string;
  noOfTravelers?: string;
  travelingStartDate?: Date | string;
  travelingEndDate?: Date | string;
  type: "contact" | "bespokePlan" | "booking" | "newsLetter";
  status: "read" | "unread";
  tours?: any;
}

export interface BecomePartnerFormResponse {
  id: number;
  name?: string;
  contactingAbout?: string;
  phone?: string;
  email?: string;
  description?: string;
  webAddress?: string;
  gReCaptchaToken?: string;
  relevantDepartment?: string;
  jobTitle?: string;
  status: "read" | "unread";
  becomePartnerFormQuestionAndAnswer?: any[];
}

export interface BeSpokeFormResponse {
  id: number;
  name?: string;
  email?: string;
  phoneNumber?: string;
  preferredCountry?: string;
  countryCode?: string;
  otherCountry?: string;
  tripDays?: string;
  bespokeFormQuestionAndAnswer?: any[];
  whereDidYouHear: string;
  social?: string;
  referralName?: string;
  other?: string;
  travelingStartDate?: Date;
  travelingEndDate?: Date;
  gReCaptchaToken?: string;
  status: "read" | "unread";
}
export interface ConfigurationResponse {
  id?: number;
  logoId?: string;
  favIconId?: string;
  title: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  siteDescription: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  createdAt: string;
  updatedAt: string;
  media?: MediaResponse;
}

export interface HolidayTypesResponse {
  id?: number;
  name: string;
  description?: string;
  imageId?: number;
  mainSectionHeading: string;
  mainSectionDescription: string;
  isActive: string;
  createdAt: string;
  updatedAt: string;
  media?: MediaResponse;
  highlights: HighlightsResponse[];
  seoMeta: SeoMetaResponse;
}
export interface HighlightsResponse {
  id?: number;
  description?: string;
  imageId?: string;
  media: MediaResponse;
}

export interface InspirationResponse {
  id?: number;
  inspirationId?: number;
  title?: string;
  description?: string;
  imageId?: string;
  isFeatured?: boolean | string;
  isActive?: boolean;
  readingTime?: number | null;
  holidayTypeId?: number;
  destinationId?: number;
  inspirationSortId: number;
  sortId?: number;
  media?: MediaResponse;
  destination: DestinationsResponse[];
  holidayType: HolidayTypesResponse[];
  inspirationDetail: InspirationDetail[];
  createdAt: Date;
  seoMeta: SeoMeta;
}

export interface InspirationDetail {
  id?: number;
  title?: string;
  description?: string;
  imageId?: string;
  blogId?: number;
}
export interface SeoMeta {
  id?: number;
  title?: string;
  keywords?: string;
  description?: string;
  slug?: string;
}
export interface TestimonialResponse {
  id?: number;
  title?: string;
  description?: string;
  clientName?: string;
  clientLocation?: string;
  clientImageMedia?: MediaResponse;
  clientImageId?: number;
  destinationImageId?: number;
  sortId: number;
  testimonialId?: number;
  destinationImageMedia?: MediaResponse;
}
export interface SeoMetaResponse {
  id?: number;
  title?: string;
  description?: string;
  slug?: string;
  keywords?: string;
}
export interface DestinationsResponse {
  id?: number;
  name: string;
  description?: string;
  isActive: boolean;
  seoMeta: SeoMetaResponse;
  content: ContentResponse[];
  tours: [];
  destinationFeatureOffered: DestinationFeatureOfferedResponse[];
}

export interface DestinationFeatureOfferedResponse {
  id?: number;
  title?: string;
  description?: string;
}

export interface TourResponse {
  id?: number;
  title?: string;
  destinationId?: number;
  bannerImageMedia?: MediaResponse;
  description?: string;
  accommodationImageMedia?: MediaResponse;
  accommodationImageId?: number;
  bannerImageId?: number;
  days?: string;
  price?: string;
  planDays?: number;
  airFairIncluded?: boolean;
  accommodationImage?: string;
  planServiceId?: number;
  planService: any;
  ratings?: number;
  isRecommended: boolean;
  meetingPoint?: string;
  departurePoint?: string;
  isActive?: boolean;
  travelingFromDescription?: string;
  weatherDescription?: string;
  whenToGoDescription?: string;
  cuisineDescription?: string;
  overviewTitle?: string;
  overviewDescription?: string;
  physicalActivityDescription?: string;
  makeItPrivateDescription?: string;
  isFeatured?: boolean;
  holidayTypeId?: number;
  createdAt?: string;
  updatedAt?: string;
  pricingTitle?: string;
  pricingDescription?: string;
  highlights?: HighlightsResponse[];
  dayToDayItinerary?: DayTodayItineraryResponse[];
  privatePlan?: PrivatePlanResponse[];
  supplementPolicy?: SupplementPolicyResponse[];
  destination?: DestinationsResponse;
  seoMeta: SeoMetaResponse;
}

export interface DayTodayItineraryResponse {
  id?: number;
  description?: string;
  imageId?: string;
  destination?: string;
  accommodation?: string;
}

export interface PrivatePlanResponse {
  id?: number;
  perPersonRate?: string;
  minimumPersons?: string;
  maximumPersons?: string;
}

export interface SupplementPolicyResponse {
  id?: number;
  description?: string;
  title?: string;
  subTitle?: string;
}
export interface ThingsToDoResponse {
  id?: number;
  title: string;
  description?: string;
  imageId?: string;
  destinationId?: number;
  isActive: string;
  createdAt: string;
  updatedAt: string;
}

export interface BespokeQuestionResponse {
  id: number;
  type: string;
  question: string;
  formType: string;
  addOtherOption: boolean;
  textPlaceholder: string;
  sortId: number;
  bespokeQuestionOptionId?: number;
  bespokeQuestionOptions: bespokeQuestionOptionsResponse[];
}
export interface bespokeQuestionOptionsResponse {
  id: number;
  label: string;
}

export interface ISTableContent {
  isLoading?: boolean;
  onPagination?: Function;
  tableHeadings?: any;
  tableContent: Array<any>;
  isActionButtons?: Boolean;
  currentPage?: number;
  onDragEnd?: Function;
  pageSize?: number;
  isPageSizeEnable?: boolean;
  isDraggable?: boolean;
  isPaginationEnable?: boolean;
  onPageSize?: Function;
  onSearch?: Function;
  count?: number;
  actionHandles?: {
    onEdit?: Function;
    onDelete?: Function;
    onView?: Function;
  };
}
