import { createRouter, createWebHistory } from "vue-router";
import PresentationView from "../views/Presentation/PresentationView.vue";
import JobseekerLogin from "../views/home/JobseekerLogin/login.vue";
import RSPortal from "../views/home/RSPortal.vue";
import ResetPassword from "../views/ResetPassword/ResetPassword.vue";
import JobseekerRegister from "../views/register/JobSeekerRegister.vue";
import VerifyPassword from "../views/verifypassword/verifyAccount.vue";
import AboutView from "../views/LandingPages/AboutUs/AboutView.vue";
import ContactView from "../views/LandingPages/ContactUs/ContactView.vue";
import AuthorView from "../views/LandingPages/Author/AuthorView.vue";
import SignInBasicView from "../views/LandingPages/SignIn/BasicView.vue";
import PageHeaders from "../layouts/sections/page-sections/page-headers/HeadersView.vue";
import PageFeatures from "../layouts/sections/page-sections/features/FeaturesView.vue";
import NavigationNavbars from "../layouts/sections/navigation/navbars/NavbarsView.vue";
import NavigationNavTabs from "../layouts/sections/navigation/nav-tabs/NavTabsView.vue";
import NavigationPagination from "../layouts/sections/navigation/pagination/PaginationView.vue";
import InputAreasInputs from "../layouts/sections/input-areas/inputs/InputsView.vue";
import InputAreasForms from "../layouts/sections/input-areas/forms/FormsView.vue";
import ACAlerts from "../layouts/sections/attention-catchers/alerts/AlertsView.vue";
import ACModals from "../layouts/sections/attention-catchers/modals/ModalsView.vue";
import ACTooltipsPopovers from "../layouts/sections/attention-catchers/tooltips-popovers/TooltipsPopoversView.vue";
import ElAvatars from "../layouts/sections/elements/avatars/AvatarsView.vue";
import ElBadges from "../layouts/sections/elements/badges/BadgesView.vue";
import ElBreadcrumbs from "../layouts/sections/elements/breadcrumbs/BreadcrumbsView.vue";
import ElButtons from "../layouts/sections/elements/buttons/ButtonsView.vue";
import ElButtonGroups from "../layouts/sections/elements/button-groups/ButtonGroupsView.vue";
import ElDropdowns from "../layouts/sections/elements/dropdowns/DropdownsView.vue";
import ElProgressBars from "../layouts/sections/elements/progress-bars/ProgressBarsView.vue";
import ElToggles from "../layouts/sections/elements/toggles/TogglesView.vue";
import ElTypography from "../layouts/sections/elements/typography/TypographyView.vue";

import TestModals from "../views/TestModals/TestModals.vue";

import Login from "../views/Authentication/LoginPage.vue"
import Register from "../views/Authentication/RegisterPage.vue"
import RegisterBasicInfo from "../views/Authentication/RegisterBasicInfo.vue"
import ForgotPassword from "../views/Authentication/ForgotPassword.vue";
import ForgotPasswordSuccess from "../views/Authentication/ForgotPasswordSuccess.vue";

import CorporateApps from"../views/CorporateApps/TheIndex.vue";
import Masterfiles from "../views/CorporateApps/Masterfiles/TheIndex.vue"
import Accounting from "../views/CorporateApps/Accounting/TheIndex.vue"
import Timesheet from "../views/CorporateApps/Timesheet/TheIndex.vue"
import RDA from "../views/CorporateApps/RDA/TheIndex.vue";
import HRIS from "../views/CorporateApps/HRIS/TheIndex.vue";
import Jobseeker from "../views/Jobseeker/Jobseeker.vue";
import Client from "../views/Client/TheIndex.vue";

import TempCrf from "../views/TestModals/TempCRF.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "landing-page",
      component: RSPortal,
    },
    {
      path: "/pages/landing-pages/about-us",
      name: "about",
      component: AboutView,
    },
    {
      path: "/pages/landing-pages/contact-us",
      name: "contactus",
      component: ContactView,
    },
    {
      path: "/pages/landing-pages/author",
      name: "author",
      component: AuthorView,
    },
    {
      path: "/pages/landing-pages/basic",
      name: "signin-basic",
      component: SignInBasicView,
    },
    {
      path: "/sections/page-sections/page-headers",
      name: "page-headers",
      component: PageHeaders,
    },
    {
      path: "/sections/page-sections/features",
      name: "page-features",
      component: PageFeatures,
    },
    {
      path: "/sections/navigation/navbars",
      name: "navigation-navbars",
      component: NavigationNavbars,
    },
    {
      path: "/sections/navigation/nav-tabs",
      name: "navigation-navtabs",
      component: NavigationNavTabs,
    },
    {
      path: "/sections/navigation/pagination",
      name: "navigation-pagination",
      component: NavigationPagination,
    },
    {
      path: "/sections/input-areas/inputs",
      name: "inputareas-inputs",
      component: InputAreasInputs,
    },
    {
      path: "/sections/input-areas/forms",
      name: "inputareas-forms",
      component: InputAreasForms,
    },
    {
      path: "/sections/attention-catchers/alerts",
      name: "ac-alerts",
      component: ACAlerts,
    },
    {
      path: "/sections/attention-catchers/modals",
      name: "ac-modals",
      component: ACModals,
    },
    {
      path: "/sections/attention-catchers/tooltips-popovers",
      name: "ac-tooltips-popovers",
      component: ACTooltipsPopovers,
    },
    {
      path: "/sections/elements/avatars",
      name: "el-avatars",
      component: ElAvatars,
    },
    {
      path: "/sections/elements/badges",
      name: "el-badges",
      component: ElBadges,
    },
    {
      path: "/sections/elements/breadcrumbs",
      name: "el-breadcrumbs",
      component: ElBreadcrumbs,
    },
    {
      path: "/sections/elements/buttons",
      name: "el-buttons",
      component: ElButtons,
    },
    {
      path: "/sections/elements/button-groups",
      name: "el-button-groups",
      component: ElButtonGroups,
    },
    {
      path: "/sections/elements/dropdowns",
      name: "el-dropdowns",
      component: ElDropdowns,
    },
    {
      path: "/sections/elements/progress-bars",
      name: "el-progress-bars",
      component: ElProgressBars,
    },
    {
      path: "/sections/elements/toggles",
      name: "el-toggles",
      component: ElToggles,
    },
    {
      path: "/sections/elements/typography",
      name: "el-typography",
      component: ElTypography,
    },
    {
      path: "/register",
      name: "rs-register",
      component: JobseekerRegister,
    },
    {
      path: "/change-password",
      name: "rs-reset-pass",
      component: ResetPassword,
    },
    {
      path: "/verify-account",
      name: "rs-verify-account",
      component: VerifyPassword,
    },
    {
      path: "/login/:registrantType",
      name: "registrant-type-login",
      component: Login,
    },
    {
      path: "/register/:registrantType",
      name: "registrant-type-register",
      component: Register,
    },
    {
      path: "/register/basic-info/:registrantType",
      name: "registrant-type-register-basic-info",
      component: RegisterBasicInfo,
    },
    {
      path: "/forgot-password/:registrantType",
      name: "registrant-type-forgot-password",
      component: ForgotPassword,
    },
    {
      path: "/confirmation/:registrantType",
      name: "registrant-type-forgot-password-success",
      component: ForgotPasswordSuccess,
    },
    {
      path: "/testmodals",
      name: "testmodals",
      component: TestModals
    },
    {
      path: "/admin/corporate-apps",
      name: "admin-corporate-apps",
      component: CorporateApps
    },
    {
      path: "/admin/corporate-apps/accounting/:slug",
      name: "admin-corporate-apps-accounting",
      component: Accounting
    },
    {
      path: "/admin/corporate-apps/timesheet/:view",
      name: "admin-corporate-apps-timesheet",
      component: Timesheet
    },
    {
      path: "/admin/corporate-apps/masterfiles/:slug",
      name: "admin-corporate-apps-masterfiles",
      component: Masterfiles
    },
    {
      path: "/admin/corporate-apps/rda-dashboard/:slug",
      name: "admin-corporate-apps-rda",
      component: RDA
    },
    {
      path: "/admin/corporate-apps/hris/:slug",
      name: "admin-corporate-apps-hris",
      component: HRIS
    },
    {
      path: "/jobseeker/:view",
      name: "jobseeker",
      component: Jobseeker
    },
    {
      path: "/remote-contractor/:view",
      name: "remote-contractor",
      component: Jobseeker
    },
    {
      path: "/client/:view",
      name: "client",
      component: Client
    },
    {
      path: "/tempCRF/contract-request-form/:bullhornId",
      name: "contract-request-form",
      component: TempCrf
    }
  ],
});

export default router;