#!/usr/bin/env python3
"""
Script para atualizar os dados dos times do NASA Space Apps Challenge
Faz uma requisição GraphQL para a API e atualiza o arquivo teams.json
"""

import json
import requests
from typing import Dict, Any, List

def fetch_teams_page(location_id: str, after_cursor: str = "") -> Dict[str, Any]:
    """
    Faz uma requisição GraphQL para buscar uma página de dados dos times de uma cidade específica
    """
    url = "https://api.spaceappschallenge.org/graphql"

    # Headers necessários para a requisição
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "application/json",
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
        "Origin": "https://www.spaceappschallenge.org",
        "Referer": "https://www.spaceappschallenge.org/2025/local-events/?tab=teams"
    }

    # Payload GraphQL conforme especificado
    payload = [
        {
            "operationName": "Page",
            "variables": {
                "input": "aWQ6MzEzMzI="
            },
            "query": """query Page($input: EncodedID!) {
  page(id: $input) {
    __typename
    id
    ...CorePageFields
    ...EventHomePageFields
    ...SiteHomePageFields
    ...CommonPageFields
    ...FormPageFields
    ...SignUpFormPageFields
    ...BlogPageFields
    ...BlogsIndexPageFields
    ...ResourcesIndexPageFields
    ...ResourceGuidePageFields
    ...DirectoryPageFields
    ...LandingPageFields
    ...ProfilePageFields
    ...LocalEventPageFields
    ...LocalEventIndexFields
    ...EventRegistrationPageFields
    ...MessagesIndexPageFields
    ...ChallengesIndexPageFields
    ...ChallengePageFields
    ...TeamsIndexFields
    ...TeamPageFields
    ...CreateTeamFormPageFields
    ...AwardPageFields
    ...AwardsIndexPageFields
    ...JudgingPageFields
    ...JudgingIndexPageFields
    ...OffersPageFields
  }
}

fragment CorePageFields on ICmsPage {
  __typename
  id
  title
  meta {
    ...ExpandedPageMetaFields
    __typename
  }
}

fragment ExpandedPageMetaFields on ExpandedPageMeta {
  type
  slug
  firstPublishedAt
  lastPublishedAt
  relativeUrl
  live
  parent {
    id
    __typename
  }
  __typename
}

fragment EventHomePageFields on EventHomePage {
  heroContent
  includeEventCtas
  featuredImage {
    ...CustomImageFields
    __typename
  }
  event
  eventDetails {
    ...PublicEventFields
    __typename
  }
  eventPages {
    ...EventPagesFields
    __typename
  }
  content {
    ...CoreBlockFields
    ...HtmlBlockFields
    ...CustomImageBlockFields
    ...QuoteBlockFields
    ...CarouselBlockFields
    ...EventMilestonesFields
    ...EventTaskGroupFields
    ...CtaGroupBlockFields
    ...GroupBlockFields
    __typename
  }
  __typename
}

fragment CustomImageFields on DefaultImage {
  id
  meta {
    type
    downloadUrl
    __typename
  }
  title
  alt
  caption
  displaySize
  rendition {
    ...BaseImageFields
    __typename
  }
  __typename
}

fragment BaseImageFields on BaseImage {
  url
  fullUrl
  height
  width
  __typename
}

fragment PublicEventFields on GlobalEvent {
  ...CoreEventFields
  timezone
  teamMemberLimit
  eventRegistrationStatus
  localEventRegistrationStatus
  teamRegistrationStatus
  isTeamPagesActive
  isAwardsActive
  isChallengePagesActive
  localEventEditStatus
  teamEditStatus
  teamStreamEditStatus
  projectEditStatus
  localEventJudgingStatus
  nominationJudgingStatus
  projectFields {
    title
    caption
    fieldMapping
    fieldType
    __typename
  }
  __typename
}

fragment CoreEventFields on GlobalEvent {
  __typename
  id
  name
  displayName
  slug
  status
  startDate
  endDate
  certificate
  createRegistrationForm
  editRegistrationForm
  createTeamForm
}

fragment EventPagesFields on EventPages {
  eventPage
  registrationPage
  localEventsPage
  challengesPage
  teamsPage
  createTeamPage
  judgingPage
  __typename
}

fragment CoreBlockFields on IStreamBlock {
  __typename
  id
  type
}

fragment HtmlBlockFields on HtmlBlock {
  value {
    html
    __typename
  }
  __typename
}

fragment CustomImageBlockFields on CustomImageBlock {
  value {
    layout {
      align
      position
      captionDisplay
      __typename
    }
    link {
      ...LinkFields
      __typename
    }
    sizedImage {
      ...CustomImageFields
      __typename
    }
    __typename
  }
  __typename
}

fragment LinkFields on LinkValue {
  url
  text
  isNewTab
  __typename
}

fragment QuoteBlockFields on QuoteBlock {
  value {
    quote
    author
    avatar {
      ...CustomImageFields
      __typename
    }
    __typename
  }
  __typename
}

fragment CarouselBlockFields on CarouselBlock {
  value {
    title
    richTextContent: content
    featuredImage {
      ...CustomImageFields
      __typename
    }
    autoPlay
    showArrows
    showBullets
    showFraction
    slidesPerView
    controlPosition
    viewStyle
    viewTheme
    slides {
      ...CoreBlockFields
      ...CardBlockFields
      ...CustomImageBlockFields
      ...HtmlBlockFields
      ...QuoteBlockFields
      ...TeamBlockFields
      __typename
    }
    __typename
  }
  __typename
}

fragment CardBlockFields on CardBlock {
  value {
    title
    subTitle
    text
    link {
      ...LinkFields
      __typename
    }
    image {
      ...CustomImageFields
      __typename
    }
    __typename
  }
  __typename
}

fragment TeamBlockFields on TeamBlock {
  value {
    award
    awardIcon {
      ...CustomImageFields
      __typename
    }
    title
    localEvent
    challenge
    image {
      ...CustomImageFields
      __typename
    }
    link {
      ...LinkFields
      __typename
    }
    __typename
  }
  __typename
}

fragment EventMilestonesFields on EventMilestonesBlock {
  value {
    title
    richText
    tasks {
      ...EventTaskFields
      __typename
    }
    __typename
  }
  __typename
}

fragment EventTaskFields on EventTask {
  title
  endDate
  url
  popup
  completionAction
  actionLabel
  isComplete
  description
  completionCondition
  __typename
}

fragment EventTaskGroupFields on EventTaskGroupBlock {
  value {
    title
    event {
      ...PublicEventFields
      __typename
    }
    tasks {
      ...EventTaskFields
      __typename
    }
    __typename
  }
  __typename
}

fragment CtaGroupBlockFields on CtaGroupBlock {
  value {
    title
    richText
    columns
    align
    ctas {
      title
      subtitle
      text
      link {
        ...LinkFields
        __typename
      }
      icon {
        ...CustomImageFields
        __typename
      }
      __typename
    }
    __typename
  }
  __typename
}

fragment GroupBlockFields on GroupBlock {
  value {
    theme
    layout {
      direction
      justify
      align
      __typename
    }
    backgroundImage {
      ...CustomImageFields
      __typename
    }
    blocks {
      ...CoreBlockFields
      ...HtmlBlockFields
      ...CustomImageBlockFields
      ...QuoteBlockFields
      ...AccordionBlockFields
      ...CtaDualImageBlockFields
      ...CtaGroupBlockFields
      ...TileGroupBlockFields
      ...StatisticGroupBlockFields
      ...FeaturedPostsBlockFields
      ...SocialMediaFeedBlockFields
      __typename
    }
    __typename
  }
  __typename
}

fragment AccordionBlockFields on AccordionBlock {
  value {
    title
    panels {
      title
      richText
      __typename
    }
    __typename
  }
  __typename
}

fragment CtaDualImageBlockFields on CtaDualImageBlock {
  value {
    position
    cta {
      title
      text
      link {
        ...LinkFields
        __typename
      }
      __typename
    }
    primaryImage {
      ...CustomImageFields
      __typename
    }
    secondaryImage {
      ...CustomImageFields
      __typename
    }
    __typename
  }
  __typename
}

fragment TileGroupBlockFields on TileGroupBlock {
  value {
    title
    richText
    tiles {
      title
      text
      image {
        ...CustomImageFields
        __typename
      }
      link {
        ...LinkFields
        __typename
      }
      __typename
    }
    __typename
  }
  __typename
}

fragment StatisticGroupBlockFields on StatisticGroupBlock {
  value {
    title
    richText
    statistics {
      statistic
      title
      text
      __typename
    }
    __typename
  }
  __typename
}

fragment FeaturedPostsBlockFields on FeaturedPostsBlock {
  value {
    title
    subTitle
    indexLink
    indexLinkText
    pages {
      ...FeaturedBlogFields
      __typename
    }
    __typename
  }
  __typename
}

fragment FeaturedBlogFields on BlogListing {
  id
  title
  subTitle
  excerpt
  meta {
    type
    firstPublishedAt
    lastPublishedAt
    relativeUrl
    __typename
  }
  featuredImage {
    ...CustomImageFields
    __typename
  }
  categories {
    id
    slug
    name
    __typename
  }
  __typename
}

fragment SocialMediaFeedBlockFields on SocialMediaFeedBlock {
  value {
    title
    ctaLabel
    accounts {
      account
      handle
      url
      __typename
    }
    __typename
  }
  __typename
}

fragment SiteHomePageFields on SiteHomePage {
  heroContent
  featuredImage {
    ...CustomImageFields
    __typename
  }
  featuredVideo {
    ...CustomVideoFields
    __typename
  }
  content {
    ...CoreBlockFields
    ...HtmlBlockFields
    ...CustomImageBlockFields
    ...QuoteBlockFields
    ...AccordionBlockFields
    ...CtaDualImageBlockFields
    ...CtaGroupBlockFields
    ...TileGroupBlockFields
    ...FeaturedPostsBlockFields
    ...StatisticGroupBlockFields
    ...SocialMediaFeedBlockFields
    ...GroupBlockFields
    ...CarouselBlockFields
    ...SnippetBlockFields
    __typename
  }
  __typename
}

fragment CustomVideoFields on DefaultVideo {
  id
  meta {
    type
    __typename
  }
  title
  contentType
  rendition {
    ...BaseVideoFields
    __typename
  }
  __typename
}

fragment BaseVideoFields on BaseVideo {
  url
  fullUrl
  duration
  __typename
}

fragment SnippetBlockFields on SnippetBlock {
  value {
    id
    ...SharedContentFields
    __typename
  }
  __typename
}

fragment SharedContentFields on SharedContentValue {
  id
  name
  theme
  position
  backgroundImage {
    ...CustomImageFields
    __typename
  }
  content {
    ...CoreBlockFields
    ...HtmlBlockFields
    ...CustomImageBlockFields
    ...QuoteBlockFields
    ...AccordionBlockFields
    ...FormPageBlockFields
    ...ModalFormBlockFields
    ...StatisticGroupBlockFields
    ...SocialMediaFeedBlockFields
    __typename
  }
  __typename
}

fragment FormPageBlockFields on FormPageBlock {
  value {
    id
    ...FormValueFields
    __typename
  }
  __typename
}

fragment FormValueFields on FormPageBlockValue {
  id
  title
  intro
  confirmationText
  submitText
  resetText
  formFields {
    id
    ...FormFields
    __typename
  }
  __typename
}

fragment FormFields on IFormField {
  id
  label
  cleanName
  fieldType
  fieldGroup {
    name
    slug
    __typename
  }
  fieldPanel {
    name
    slug
    __typename
  }
  fieldMapping
  required
  useConfirmation
  useValidation
  allChoices
  defaultValue
  helpText
  placeholder
  __typename
}

fragment ModalFormBlockFields on ModalFormBlock {
  value {
    text
    formPage {
      id
      ...FormValueFields
      __typename
    }
    __typename
  }
  __typename
}

fragment CommonPageFields on CommonPage {
  shortName
  breadcrumbs {
    ...BreadcrumbFields
    __typename
  }
  featuredImage {
    ...CustomImageFields
    __typename
  }
  heroContent
  content {
    ...CoreBlockFields
    ...HtmlBlockFields
    ...CustomImageBlockFields
    ...QuoteBlockFields
    ...AccordionBlockFields
    ...CtaDualImageBlockFields
    ...CtaGroupBlockFields
    ...TileGroupBlockFields
    ...FeaturedPostsBlockFields
    ...StatisticGroupBlockFields
    ...SocialMediaFeedBlockFields
    ...GroupBlockFields
    ...CarouselBlockFields
    ...SnippetBlockFields
    __typename
  }
  __typename
}

fragment BreadcrumbFields on Breadcrumb {
  name
  link
  __typename
}

fragment FormPageFields on FormPage {
  __typename
  shortName
  breadcrumbs {
    ...BreadcrumbFields
    __typename
  }
  intro
  confirmationText
  submitText
  resetText
  useRecaptcha
  formFields {
    __typename
    ...FormFields
  }
}

fragment SignUpFormPageFields on SignUpPage {
  __typename
  shortName
  title
  pageContent
  confirmation
  submitLabel
  signInLabel
  useRecaptcha
  createAccountForm
  formFields {
    __typename
    ...FormFields
  }
}

fragment BlogPageFields on BlogPage {
  breadcrumbs {
    ...BreadcrumbFields
    __typename
  }
  subTitle
  featuredImage {
    ...CustomImageFields
    __typename
  }
  content {
    ...CoreBlockFields
    ...CustomImageBlockFields
    ...HtmlBlockFields
    ...QuoteBlockFields
    __typename
  }
  author {
    ...DirectoryProfileFields
    __typename
  }
  __typename
}

fragment DirectoryProfileFields on DirectoryProfile {
  id
  name
  role
  organization
  title
  biography
  isActive
  avatar {
    ...CustomImageFields
    __typename
  }
  __typename
}

fragment BlogsIndexPageFields on BlogsIndexPage {
  breadcrumbs {
    ...BreadcrumbFields
    __typename
  }
  featuredBlog {
    ...FeaturedBlogFields
    __typename
  }
  modelIndex {
    ...ModelIndexFields
    __typename
  }
  contentHeader
  blogLimit
  searchHeader
  filterText
  __typename
}

fragment ModelIndexFields on ModelIndex {
  __typename
  id
  name
  enabledSearch
  enabledFilter
  menuTitle
  menuDescription
  filters {
    name
    label
    field
    menu
    values
    __typename
  }
}

fragment ResourcesIndexPageFields on ResourcesIndexPage {
  shortName
  breadcrumbs {
    ...BreadcrumbFields
    __typename
  }
  heroContent
  enableSearch
  searchPlaceholder
  noSearchResults
  resourceGroups {
    __typename
    id
  }
  __typename
}

fragment ResourceGuidePageFields on ResourceGuidePage {
  shortName
  breadcrumbs {
    ...BreadcrumbFields
    __typename
  }
  restrictByRole
  summary
  resources {
    ...ResourceFields
    __typename
  }
  __typename
}

fragment ResourceFields on Resource {
  __typename
  id
  title
  slug
  hasVideo
  content {
    ...CoreBlockFields
    ...HtmlBlockFields
    ...CustomImageBlockFields
    ...QuoteBlockFields
    ...AccordionBlockFields
    ...CarouselBlockFields
    ...ResourceGroupBlockFields
    __typename
  }
}

fragment ResourceGroupBlockFields on GroupBlock {
  value {
    theme
    layout {
      direction
      justify
      align
      __typename
    }
    backgroundImage {
      ...CustomImageFields
      __typename
    }
    blocks {
      ...CoreBlockFields
      ...HtmlBlockFields
      ...CustomImageBlockFields
      ...QuoteBlockFields
      ...AccordionBlockFields
      ...CarouselBlockFields
      __typename
    }
    __typename
  }
  __typename
}

fragment DirectoryPageFields on DirectoryPage {
  shortName
  breadcrumbs {
    ...BreadcrumbFields
    __typename
  }
  heroContent
  showActive
  showInactive
  filterRoles
  content {
    ...CoreBlockFields
    ...CustomImageBlockFields
    ...HtmlBlockFields
    ...QuoteBlockFields
    ...CtaGroupBlockFields
    __typename
  }
  __typename
}

fragment LandingPageFields on LandingPage {
  shortName
  breadcrumbs {
    ...BreadcrumbFields
    __typename
  }
  featuredImage {
    ...CustomImageFields
    __typename
  }
  heroContent
  content {
    ...CoreBlockFields
    ...HtmlBlockFields
    ...CustomImageBlockFields
    ...QuoteBlockFields
    ...AccordionBlockFields
    ...CtaDualImageBlockFields
    ...CtaGroupBlockFields
    ...TileGroupBlockFields
    ...FeaturedPostsBlockFields
    ...StatisticGroupBlockFields
    ...SocialMediaFeedBlockFields
    ...GroupBlockFields
    ...CarouselBlockFields
    ...SnippetBlockFields
    __typename
  }
  __typename
}

fragment ProfilePageFields on ProfilePage {
  __typename
  shortName
  breadcrumbs {
    ...BreadcrumbFields
    __typename
  }
  title
  submitLabel
  editLabel
  resetLabel
  accountLabel
  participantLabel
  participantDefault
  summaryLabel
  summaryDescription
  editAccountForm
  accountFields {
    __typename
    ...FormFields
  }
  participantFields {
    __typename
    ...FormFields
  }
}

fragment LocalEventPageFields on LocationPage {
  breadcrumbs {
    ...BreadcrumbFields
    __typename
  }
  event
  eventDetails {
    ...PublicEventFields
    __typename
  }
  eventPages {
    ...EventPagesFields
    __typename
  }
  schedule {
    title
    startDate
    endDate
    description
    __typename
  }
  isHostEvent
  isHybrid
  isVirtual
  isWaitlist
  cachedRegistrations
  cachedWaitlist
  realTimeRegistrations
  realTimeVirtualRegistrations
  realTimeWaitlist
  realTimeVirtualWaitlist
  ...LocalEventPageEditableFields
  __typename
}

fragment LocalEventPageEditableFields on LocationPage {
  revisionMeta {
    ...PageRevisionMetaFields
    __typename
  }
  workflow {
    ...PageWorkflowFields
    __typename
  }
  displayName
  eventType
  memberships {
    user
    userDetails {
      id
      fullName
      username
      country
      avatar {
        ...CustomImageFields
        __typename
      }
      __typename
    }
    __typename
  }
  schedule {
    title
    startDate
    endDate
    description
    __typename
  }
  contactEmail
  socialLinks
  country
  venueName
  venueAddress
  venueGeoLocation {
    type
    coordinates
    __typename
  }
  featuredImage {
    ...CustomImageFields
    __typename
  }
  contactDescription
  richtextAlert
  richtextContent
  registrationEnabled
  registrationLimit
  virtualRegistrationLimit
  autoPromoteWaitlist
  timezone
  startDate
  endDate
  submissionDeadline
  liveStreamUrl
  liveStreamStartDate
  liveStreamEndDate
  projectsSubmitted
  availableNominations
  peoplesChoiceTeam
  teamNominations
  owner
  __typename
}

fragment PageRevisionMetaFields on RevisionPageMeta {
  locked
  lockedAt
  lockedBy {
    id
    fullName
    username
    __typename
  }
  hasUnpublishedChanges
  owner {
    id
    fullName
    username
    __typename
  }
  __typename
}

fragment PageWorkflowFields on PageWorkflow {
  status
  lastComment
  inProgress
  __typename
}

fragment LocalEventIndexFields on LocationsIndexPage {
  breadcrumbs {
    ...BreadcrumbFields
    __typename
  }
  mapboxStyleUrl
  showMap
  pageFooter {
    ...SharedContentFields
    __typename
  }
  scheduleCardTitle
  scheduleCardText
  eventStartLabel
  localEventStartLabel
  localEventSubmissionLabel
  leadsCardTitle
  leadsCardText
  socialCardTitle
  socialCardText
  chatCardTitle
  chatCardText
  chatCardLink
  chatCardLinkLabel
  showChatCard
  localEventRegisterCta
  registrationContent
  existingRegistrationContent
  unregistrationContent
  registrationSuccess
  waitlistSuccess
  unregistrationSuccess
  detailsTabLabel
  detailsTabForm
  scheduleTabLabel
  scheduleTabForm
  teamsTabLabel
  teamsTabContent
  showTeamsTab
  judgingTabLabel
  judgingTabContent
  showJudgingTab
  participantTabLabel
  showParticipantTab
  noResultsContent
  alertContent
  createRegistrationForm
  editRegistrationForm
  participantEditRegistrationForm
  event
  eventDetails {
    ...PublicEventFields
    __typename
  }
  eventPages {
    ...EventPagesFields
    __typename
  }
  modelIndex {
    ...ModelIndexFields
    __typename
  }
  teamsIndex {
    ...ModelIndexFields
    __typename
  }
  registrationsIndex {
    ...ModelIndexFields
    __typename
  }
  judgingIndex {
    ...ModelIndexFields
    __typename
  }
  __typename
}

fragment EventRegistrationPageFields on EventRegistrationPage {
  shortName
  breadcrumbs {
    ...BreadcrumbFields
    __typename
  }
  featuredImage {
    ...CustomImageFields
    __typename
  }
  countdownDate
  heroContent
  registeredMessage
  event
  eventDetails {
    timezone
    ...PublicEventFields
    __typename
  }
  eventPages {
    ...EventPagesFields
    __typename
  }
  content {
    ...CoreBlockFields
    ...HtmlBlockFields
    ...CustomImageBlockFields
    ...QuoteBlockFields
    ...EventMilestonesFields
    ...EventTaskGroupFields
    ...CtaGroupBlockFields
    __typename
  }
  __typename
}

fragment MessagesIndexPageFields on MessagesIndexPage {
  breadcrumbs {
    ...BreadcrumbFields
    __typename
  }
  adminFromAvatar {
    ...CustomImageFields
    __typename
  }
  adminFromLabel
  submitSuccessMessage
  publishConfirmation
  unpublishConfirmation
  sendConfirmation
  publishAndSendConfirmation
  deleteConfirmation
  inboxTabLabel
  newTabLabel
  draftTabLabel
  sentTabLabel
  chatLink
  messageFormFields {
    __typename
    ...FormFields
  }
  __typename
}

fragment ChallengesIndexPageFields on ChallengesIndexPage {
  breadcrumbs {
    ...BreadcrumbFields
    __typename
  }
  featuredImage {
    ...CustomImageFields
    __typename
  }
  heroContent
  joinTeamCta
  selectedChallengeCta
  event
  eventDetails {
    ...PublicEventFields
    __typename
  }
  eventPages {
    ...EventPagesFields
    __typename
  }
  detailsTabLabel
  resourcesTabLabel
  showResourcesTab
  teamsTabLabel
  showTeamsTab
  modelIndex {
    ...ModelIndexFields
    __typename
  }
  teamsIndex {
    ...ModelIndexFields
    __typename
  }
  __typename
}

fragment ChallengePageFields on ChallengePage {
  breadcrumbs {
    ...BreadcrumbFields
    __typename
  }
  featuredImage {
    ...CustomImageFields
    __typename
  }
  event
  eventDetails {
    ...PublicEventFields
    __typename
  }
  eventPages {
    ...EventPagesFields
    __typename
  }
  categories {
    ...CategoryFields
    __typename
  }
  skills
  excerpt
  detailsContent
  resourcesTabContent
  teamsTabContent
  __typename
}

fragment CategoryFields on Category {
  ...ICategoryFields
  __typename
}

fragment ICategoryFields on ICategory {
  __typename
  id
  name
  slug
  description
  priority
  color
}

fragment TeamsIndexFields on TeamsIndexPage {
  breadcrumbs {
    ...BreadcrumbFields
    __typename
  }
  event
  eventDetails {
    ...PublicEventFields
    __typename
  }
  eventPages {
    ...EventPagesFields
    __typename
  }
  featuredImage {
    ...CustomImageFields
    __typename
  }
  heroContent
  noResultsContent
  searchHeading
  detailsTabLabel
  detailsSectionHeading
  challengeSectionHeading
  projectTabLabel
  showProjectTab
  boardTabLabel
  showBoardTab
  membersTabLabel
  showMembersTab
  membersSectionHeading
  memberRequestsSectionHeading
  chatCardTitle
  chatCardText
  chatCardLink
  chatCardLinkLabel
  showChatCard
  editHelpText
  judgingHelpText
  editTeamForm
  editProjectForm
  modelIndex {
    ...ModelIndexFields
    __typename
  }
  __typename
}

fragment TeamPageFields on TeamPage {
  breadcrumbs {
    ...BreadcrumbFields
    __typename
  }
  event
  eventDetails {
    ...PublicEventFields
    __typename
  }
  eventPages {
    ...EventPagesFields
    __typename
  }
  owner
  ownerDetails {
    id
    username
    __typename
  }
  project
  projectDetails {
    ...CoreProjectFields
    __typename
  }
  ...CoreTeamFields
  __typename
}

fragment CoreProjectFields on Project {
  id
  name
  summary
  demoLink
  projectLink
  details
  solution
  aiReferences
  dataReferences
  projectReferences
  isSubmitted
  savedAt
  submittedAt
  __typename
}

fragment CoreTeamFields on TeamPage {
  id
  title
  meta {
    ...ExpandedPageMetaFields
    __typename
  }
  owner
  ownerDetails {
    id
    username
    __typename
  }
  excerpt
  project
  projectDetails {
    ...CoreProjectFields
    __typename
  }
  projectSubmitted
  featuredImage {
    ...CustomImageFields
    __typename
  }
  description
  desiredSkills
  languages
  challenge
  challengeDetails {
    id
    title
    meta {
      ...ExpandedPageMetaFields
      __typename
    }
    excerpt
    __typename
  }
  location
  locationDetails {
    id
    title
    displayName
    meta {
      ...ExpandedPageMetaFields
      __typename
    }
    country
    __typename
  }
  event
  eventDetails {
    ...PublicEventFields
    __typename
  }
  joinEnabled
  memberships {
    user
    userDetails {
      id
      fullName
      username
      country
      avatar {
        ...CustomImageFields
        __typename
      }
      __typename
    }
    __typename
  }
  nominationBadges
  awardBadges
  __typename
}

fragment CreateTeamFormPageFields on CreateTeamPage {
  __typename
  shortName
  title
  event
  eventDetails {
    ...PublicEventFields
    __typename
  }
  eventPages {
    ...EventPagesFields
    __typename
  }
  pageContent
  helpText
}

fragment AwardPageFields on AwardPage {
  breadcrumbs {
    ...BreadcrumbFields
    __typename
  }
  featuredImage {
    ...CustomImageFields
    __typename
  }
  heroContent
  event
  eventDetails {
    ...PublicEventFields
    __typename
  }
  eventPages {
    ...EventPagesFields
    __typename
  }
  nomination
  nominationDetails {
    ...CoreNominationFields
    awards {
      ...TeamAwardFields
      __typename
    }
    __typename
  }
  template {
    ...PageTemplateFields
    __typename
  }
  disabledText
  __typename
}

fragment CoreNominationFields on Nomination {
  id
  name
  slug
  badgeLabel
  icon {
    ...CustomImageFields
    __typename
  }
  judgingStatus
  displayStatus
  event
  description
  __typename
}

fragment TeamAwardFields on Award {
  ...CoreAwardFields
  teams
  __typename
}

fragment CoreAwardFields on Award {
  id
  name
  slug
  icon {
    ...CustomImageFields
    __typename
  }
  description
  __typename
}

fragment PageTemplateFields on PageTemplate {
  id
  name
  sections {
    footer {
      ...SharedContentFields
      __typename
    }
    leftSidebar {
      ...SharedContentFields
      __typename
    }
    rightSidebar {
      ...SharedContentFields
      __typename
    }
    __typename
  }
  __typename
}

fragment AwardsIndexPageFields on AwardsIndexPage {
  breadcrumbs {
    ...BreadcrumbFields
    __typename
  }
  featuredImage {
    ...CustomImageFields
    __typename
  }
  heroContent
  event
  eventDetails {
    ...PublicEventFields
    __typename
  }
  eventPages {
    ...EventPagesFields
    __typename
  }
  modelIndex {
    ...ModelIndexFields
    __typename
  }
  content {
    ...CoreBlockFields
    ...HtmlBlockFields
    ...CustomImageBlockFields
    ...QuoteBlockFields
    ...AccordionBlockFields
    ...CtaDualImageBlockFields
    ...CtaGroupBlockFields
    ...TileGroupBlockFields
    ...FeaturedPostsBlockFields
    ...StatisticGroupBlockFields
    ...SocialMediaFeedBlockFields
    ...GroupBlockFields
    ...CarouselBlockFields
    ...SnippetBlockFields
    __typename
  }
  __typename
}

fragment JudgingPageFields on JudgingPage {
  breadcrumbs {
    ...BreadcrumbFields
    __typename
  }
  featuredImage {
    ...CustomImageFields
    __typename
  }
  heroContent
  template {
    ...PageTemplateFields
    __typename
  }
  event
  eventDetails {
    ...PublicEventFields
    __typename
  }
  eventPages {
    ...EventPagesFields
    __typename
  }
  nomination
  nominationDetails {
    ...CoreNominationFields
    judgingAwards {
      ...CoreAwardFields
      __typename
    }
    __typename
  }
  disabledText
  __typename
}

fragment JudgingIndexPageFields on JudgingIndexPage {
  breadcrumbs {
    ...BreadcrumbFields
    __typename
  }
  featuredImage {
    ...CustomImageFields
    __typename
  }
  heroContent
  sideContent
  event
  eventDetails {
    ...PublicEventFields
    __typename
  }
  eventPages {
    ...EventPagesFields
    __typename
  }
  modelIndex {
    ...ModelIndexFields
    __typename
  }
  content {
    ...CoreBlockFields
    ...HtmlBlockFields
    ...CustomImageBlockFields
    ...QuoteBlockFields
    __typename
  }
  __typename
}

fragment OffersPageFields on OffersPage {
  event
  shortName
  breadcrumbs {
    ...BreadcrumbFields
    __typename
  }
  disclaimerTitle
  disclaimerDescription
  offersTitle
  offersSummary
  offers {
    ...OfferFields
    __typename
  }
  collaboratorsTitle
  collaboratorsSummary
  collaborators
  footer
  __typename
}

fragment OfferFields on Offer {
  __typename
  id
  title
  subtitle
  image {
    ...CustomImageFields
    __typename
  }
  description
  ctaText
  ctaLink
}"""
        },
        {
            "operationName": "Teams",
            "variables": {
                "first": 100,
                "after": after_cursor,
                "q": "",
                "filtering": [
                    {
                        "field": "location",
                        "value": location_id,
                        "compare": "id"
                    }
                ]
            },
            "query": """query Teams($first: Int!, $after: String, $filtering: [Filter!], $q: String) {
  teams(first: $first, after: $after, filtering: $filtering, q: $q) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
      __typename
    }
    totalCount
    edges {
      __typename
      cursor
      node {
        __typename
        id
        ...CoreTeamFields
      }
    }
    __typename
  }
}

fragment CoreTeamFields on TeamPage {
  id
  title
  meta {
    ...ExpandedPageMetaFields
    __typename
  }
  owner
  ownerDetails {
    id
    username
    __typename
  }
  excerpt
  project
  projectDetails {
    ...CoreProjectFields
    __typename
  }
  projectSubmitted
  featuredImage {
    ...CustomImageFields
    __typename
  }
  description
  desiredSkills
  languages
  challenge
  challengeDetails {
    id
    title
    meta {
      ...ExpandedPageMetaFields
      __typename
    }
    excerpt
    __typename
  }
  location
  locationDetails {
    id
    title
    displayName
    meta {
      ...ExpandedPageMetaFields
      __typename
    }
    country
    __typename
  }
  event
  eventDetails {
    ...PublicEventFields
    __typename
  }
  joinEnabled
  memberships {
    user
    userDetails {
      id
      fullName
      username
      country
      avatar {
        ...CustomImageFields
        __typename
      }
      __typename
    }
    __typename
  }
  nominationBadges
  awardBadges
  __typename
}

fragment ExpandedPageMetaFields on ExpandedPageMeta {
  type
  slug
  firstPublishedAt
  lastPublishedAt
  relativeUrl
  live
  parent {
    id
    __typename
  }
  __typename
}

fragment CoreProjectFields on Project {
  id
  name
  summary
  demoLink
  projectLink
  details
  solution
  aiReferences
  dataReferences
  projectReferences
  isSubmitted
  savedAt
  submittedAt
  __typename
}

fragment CustomImageFields on DefaultImage {
  id
  meta {
    type
    downloadUrl
    __typename
  }
  title
  alt
  caption
  displaySize
  rendition {
    ...BaseImageFields
    __typename
  }
  __typename
}

fragment BaseImageFields on BaseImage {
  url
  fullUrl
  height
  width
  __typename
}

fragment PublicEventFields on GlobalEvent {
  ...CoreEventFields
  timezone
  teamMemberLimit
  eventRegistrationStatus
  localEventRegistrationStatus
  teamRegistrationStatus
  isTeamPagesActive
  isAwardsActive
  isChallengePagesActive
  localEventEditStatus
  teamEditStatus
  teamStreamEditStatus
  projectEditStatus
  localEventJudgingStatus
  nominationJudgingStatus
  projectFields {
    title
    caption
    fieldMapping
    fieldType
    __typename
  }
  __typename
}

fragment CoreEventFields on GlobalEvent {
  __typename
  id
  name
  displayName
  slug
  status
  startDate
  endDate
  certificate
  createRegistrationForm
  editRegistrationForm
  createTeamForm
}"""
        }
    ]

    try:
        print(f"Fazendo requisição para a API (location_id: {location_id}, cursor: {after_cursor or 'início'})...")
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        response.raise_for_status()

        data = response.json()
        print("Requisição bem-sucedida!")

        # Verifica se temos as duas respostas esperadas
        if len(data) < 2:
            raise ValueError("Resposta da API não tem o formato esperado")

        # Pega os dados dos times (índice 1 do array)
        teams_response = data[1]

        if 'data' not in teams_response or 'teams' not in teams_response['data']:
            raise ValueError("Dados dos times não encontrados na resposta")

        return teams_response['data']['teams']

    except requests.exceptions.RequestException as e:
        print(f"Erro na requisição HTTP: {e}")
        raise
    except json.JSONDecodeError as e:
        print(f"Erro ao decodificar JSON: {e}")
        raise
    except Exception as e:
        print(f"Erro inesperado: {e}")
        raise

def fetch_all_teams_for_location(location_id: str, location_name: str) -> Dict[str, Any]:
    """
    Busca todos os dados dos times de uma cidade específica paginando através de todas as páginas
    """
    all_teams = []
    after_cursor = ""
    page_num = 1
    total_count = 0

    while True:
        print(f"\n--- Buscando página {page_num} de {location_name} ---")

        # Busca uma página de dados
        teams_page = fetch_teams_page(location_id, after_cursor)

        # Extrai informações da página
        page_info = teams_page.get('pageInfo', {})
        edges = teams_page.get('edges', [])
        total_count = teams_page.get('totalCount', 0)

        print(f"Times nesta página: {len(edges)}")
        print(f"Total de times em {location_name}: {total_count}")

        # Adiciona os times desta página à lista completa
        all_teams.extend(edges)

        # Verifica se há próxima página
        if not page_info.get('hasNextPage', False):
            print(f"Última página de {location_name} alcançada!")
            break

        # Atualiza o cursor para a próxima página
        after_cursor = page_info.get('endCursor', '')
        page_num += 1

        # Adiciona um pequeno delay para ser respeitoso com a API
        import time
        time.sleep(0.5)

    # Constrói o objeto final com todos os times
    return {
        'locationId': location_id,
        'locationName': location_name,
        'teams': {
            'pageInfo': {
                'hasPreviousPage': False,
                'hasNextPage': False,
                'startCursor': all_teams[0]['cursor'] if all_teams else '',
                'endCursor': all_teams[-1]['cursor'] if all_teams else '',
                '__typename': 'PageInfo'
            },
            'totalCount': total_count,
            'edges': all_teams,
            '__typename': 'TeamPageConnection'
        }
    }

def find_location_ids(city_names: List[str]) -> Dict[str, str]:
    """
    Busca os IDs das cidades especificadas a partir da API de eventos locais
    """
    print("\n=== BUSCANDO IDs DAS CIDADES ===")

    # Busca todos os eventos locais
    all_events = []
    after_cursor = ""
    page_num = 1

    while True:
        print(f"\n--- Buscando página {page_num} de eventos locais ---")
        events_page = fetch_local_events_page(after_cursor)

        page_info = events_page.get('pageInfo', {})
        edges = events_page.get('edges', [])

        all_events.extend(edges)

        if not page_info.get('hasNextPage', False):
            break

        after_cursor = page_info.get('endCursor', '')
        page_num += 1

        import time
        time.sleep(0.5)

    # Mapeia nomes de cidades para IDs
    location_map = {}
    for edge in all_events:
        node = edge.get('node', {})
        properties = node.get('properties', {})
        title = properties.get('title', '')
        display_name = properties.get('displayName', '')
        location_id = properties.get('id', '')

        # Normaliza os nomes para comparação (remove espaços extras, lowercase)
        normalized_title = title.lower().strip()
        normalized_display = display_name.lower().strip()

        # Verifica se alguma das cidades procuradas está no título ou display_name
        for city_name in city_names:
            normalized_city = city_name.lower().strip()
            if normalized_city in normalized_title or normalized_city in normalized_display:
                location_map[city_name] = {
                    'id': location_id,
                    'title': title,
                    'displayName': display_name
                }
                print(f"✓ Encontrado: {city_name} -> {title} (ID: {location_id})")
                break

    # Verifica se todas as cidades foram encontradas
    not_found = [city for city in city_names if city not in location_map]
    if not_found:
        print(f"\n⚠ Cidades não encontradas: {', '.join(not_found)}")

    return location_map

def fetch_all_teams_data(city_names: List[str]) -> List[Dict[str, Any]]:
    """
    Busca todos os dados dos times de múltiplas cidades
    """
    # Primeiro, encontra os IDs das cidades
    location_map = find_location_ids(city_names)

    # Busca times para cada cidade encontrada
    all_cities_data = []

    for city_name, location_info in location_map.items():
        location_id = location_info['id']
        location_title = location_info['title']

        print(f"\n=== BUSCANDO TIMES DE {location_title.upper()} ===")
        city_data = fetch_all_teams_for_location(location_id, location_title)
        all_cities_data.append(city_data)

    return all_cities_data

def fetch_local_events_page(after_cursor: str = "") -> Dict[str, Any]:
    """
    Busca uma página de eventos locais da API
    """
    url = "https://api.spaceappschallenge.org/graphql"

    # Headers necessários para a requisição
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "application/json",
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
        "Origin": "https://www.spaceappschallenge.org",
        "Referer": "https://www.spaceappschallenge.org/2025/local-events"
    }

    # Payload GraphQL para eventos locais
    payload = [
        {
            "operationName": "OpenLocations",
            "variables": {
                "first": 100,
                "after": after_cursor,
                "filtering": [
                    {
                        "field": "event",
                        "value": "2025 NASA Space Apps Challenge",
                        "compare": "eq"
                    }
                ]
            },
            "query": """query OpenLocations($first: Int!, $after: String, $filtering: [Filter!], $q: String) {
  openLocations(first: $first, after: $after, filtering: $filtering, q: $q) {
    totalCount
    edges {
      cursor
      node {
        ...OpenLocationFields
        __typename
      }
      __typename
    }
    pageInfo {
      endCursor
      hasNextPage
      __typename
    }
    __typename
  }
}

fragment OpenLocationFields on LocationFeature {
  type
  geometry {
    type
    coordinates
    __typename
  }
  properties {
    id
    title
    meta {
      type
      htmlUrl
      __typename
    }
    country
    displayName
    cachedRegistrations
    eventType
    registrationEnabled
    isHostEvent
    __typename
  }
  __typename
}"""
        }
    ]

    try:
        print(f"Fazendo requisição para buscar eventos locais (cursor: {after_cursor or 'início'})...")
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        response.raise_for_status()

        data = response.json()
        print("Requisição de eventos locais bem-sucedida!")

        # Verifica se temos a resposta esperada
        if len(data) < 1:
            raise ValueError("Resposta da API não tem o formato esperado")

        # Pega os dados dos eventos locais (índice 0 do array)
        locations_response = data[0]

        if 'data' not in locations_response or 'openLocations' not in locations_response['data']:
            raise ValueError("Dados dos eventos locais não encontrados na resposta")

        return locations_response['data']['openLocations']

    except requests.exceptions.RequestException as e:
        print(f"Erro na requisição HTTP para eventos locais: {e}")
        raise
    except json.JSONDecodeError as e:
        print(f"Erro ao decodificar JSON dos eventos locais: {e}")
        raise
    except Exception as e:
        print(f"Erro inesperado ao buscar eventos locais: {e}")
        raise

def fetch_local_events_data() -> Dict[str, Any]:
    """
    Busca todos os dados dos eventos locais paginando através de todas as páginas
    """
    all_events = []
    after_cursor = ""
    page_num = 1
    total_count = 0

    while True:
        print(f"\n--- Buscando página {page_num} de eventos locais ---")

        # Busca uma página de dados
        events_page = fetch_local_events_page(after_cursor)

        # Extrai informações da página
        page_info = events_page.get('pageInfo', {})
        edges = events_page.get('edges', [])
        total_count = events_page.get('totalCount', 0)

        print(f"Eventos locais nesta página: {len(edges)}")
        print(f"Total de eventos locais: {total_count}")

        # Adiciona os eventos desta página à lista completa
        all_events.extend(edges)

        # Verifica se há próxima página
        if not page_info.get('hasNextPage', False):
            print("Última página de eventos locais alcançada!")
            break

        # Atualiza o cursor para a próxima página
        after_cursor = page_info.get('endCursor', '')
        page_num += 1

        # Adiciona um pequeno delay para ser respeitoso com a API
        import time
        time.sleep(0.5)

    # Constrói o objeto final com todos os eventos
    return {
        'pageInfo': {
            'hasPreviousPage': False,
            'hasNextPage': False,
            'startCursor': all_events[0]['cursor'] if all_events else '',
            'endCursor': all_events[-1]['cursor'] if all_events else '',
            '__typename': 'PageInfo'
        },
        'totalCount': total_count,
        'edges': all_events,
        '__typename': 'LocationConnection'
    }

def update_teams_file(all_cities_data: List[Dict[str, Any]]) -> None:
    """
    Atualiza o arquivo teams.json com os novos dados de múltiplas cidades
    """
    teams_file_path = r"src\assets\data\teams.json"

    try:
        # Cria o objeto de dados no formato esperado
        updated_data = {
            "data": all_cities_data
        }

        # Escreve os dados no arquivo
        with open(teams_file_path, 'w', encoding='utf-8') as f:
            json.dump(updated_data, f, ensure_ascii=False, indent=2)

        print(f"\nArquivo {teams_file_path} atualizado com sucesso!")

        # Mostra estatísticas básicas
        print("\n=== ESTATÍSTICAS ===")
        total_teams_all_cities = 0
        for city_data in all_cities_data:
            location_name = city_data.get('locationName', 'Desconhecido')
            teams = city_data.get('teams', {})
            total_teams = teams.get('totalCount', 0)
            teams_fetched = len(teams.get('edges', []))
            total_teams_all_cities += teams_fetched
            print(f"- {location_name}: {teams_fetched} times")

        print(f"\nTotal geral: {total_teams_all_cities} times de {len(all_cities_data)} cidades")

    except Exception as e:
        print(f"Erro ao atualizar arquivo: {e}")
        raise

def update_other_cities_teams_file(all_cities_data: List[Dict[str, Any]]) -> None:
    """
    Atualiza o arquivo otherCitiesTeams.json com os dados de outras cidades (para War Room)
    """
    teams_file_path = r"src\assets\data\otherCitiesTeams.json"

    try:
        # Cria o objeto de dados no formato esperado
        updated_data = {
            "data": all_cities_data
        }

        # Escreve os dados no arquivo
        with open(teams_file_path, 'w', encoding='utf-8') as f:
            json.dump(updated_data, f, ensure_ascii=False, indent=2)

        print(f"\nArquivo {teams_file_path} atualizado com sucesso!")

        # Mostra estatísticas básicas
        print("\n=== ESTATÍSTICAS DAS OUTRAS CIDADES ===")
        total_teams_all_cities = 0
        for city_data in all_cities_data:
            location_name = city_data.get('locationName', 'Desconhecido')
            teams = city_data.get('teams', {})
            total_teams = teams.get('totalCount', 0)
            teams_fetched = len(teams.get('edges', []))
            total_teams_all_cities += teams_fetched
            print(f"- {location_name}: {teams_fetched} times")

        print(f"\nTotal geral: {total_teams_all_cities} times de {len(all_cities_data)} cidades")

    except Exception as e:
        print(f"Erro ao atualizar arquivo de outras cidades: {e}")
        raise

def update_local_events_file(events_data: Dict[str, Any]) -> None:
    """
    Atualiza o arquivo localEvents.json com os novos dados
    """
    events_file_path = r"src\assets\data\localEvents.json"

    try:
        # Cria o objeto de dados no formato esperado
        updated_data = {
            "data": events_data.get('edges', [])
        }

        # Escreve os dados no arquivo
        with open(events_file_path, 'w', encoding='utf-8') as f:
            json.dump(updated_data, f, ensure_ascii=False, indent=2)

        print(f"Arquivo {events_file_path} atualizado com sucesso!")

        # Mostra estatísticas básicas
        total_events = events_data.get('totalCount', 0)
        events_saved = len(events_data.get('edges', []))
        print(f"Total de eventos locais: {total_events}")
        print(f"Eventos salvos no arquivo: {events_saved}")

    except Exception as e:
        print(f"Erro ao atualizar arquivo de eventos locais: {e}")
        raise

def main():
    """
    Função principal do script
    """
    try:
        print("Iniciando atualização dos dados...")

        # Lista de cidades para buscar times (Uberlândia)
        uberlandia_city = ["Uberlândia"]

        # Lista de outras cidades para comparação na War Room
        other_cities = [
            "Harohalli",
            "Cairo",
            "Kanjirappally",
            "Abu Dhabi",
            "Coimbatore",
            "Chikkamagaluru",
            "Kochi",
            "Thrissur",
            "Nashik",
            "Campinas",
            "Recife",
            "Ribeirao Preto",
            "Boa Vista",
            "Maringá",
            "São Gonçalo",
            "Jaguariúna",
            "Maceió",
            "São Paulo",
            "Guarulhos"
        ]

        # Busca dados de Uberlândia
        print(f"\n=== BUSCANDO DADOS DOS TIMES DE UBERLÂNDIA ===")
        uberlandia_teams_data = fetch_all_teams_data(uberlandia_city)

        # Atualiza o arquivo dos times de Uberlândia (para a tela de teams)
        update_teams_file(uberlandia_teams_data)

        # Busca dados das outras cidades
        print(f"\n=== BUSCANDO DADOS DOS TIMES DAS OUTRAS CIDADES ===")
        print(f"Cidades: {', '.join(other_cities)}")
        other_cities_teams_data = fetch_all_teams_data(other_cities)

        # Atualiza o arquivo dos times das outras cidades (para a war room)
        update_other_cities_teams_file(other_cities_teams_data)

        print("\n=== BUSCANDO DADOS DOS EVENTOS LOCAIS ===")
        # Busca dados dos eventos locais
        events_data = fetch_local_events_data()

        # Atualiza o arquivo dos eventos locais
        update_local_events_file(events_data)

        print("\n=== ATUALIZAÇÃO CONCLUÍDA COM SUCESSO! ===")

    except Exception as e:
        print(f"Erro durante a execução: {e}")
        return 1

    return 0

if __name__ == "__main__":
    exit(main())
