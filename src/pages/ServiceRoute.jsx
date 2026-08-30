import { useParams } from "react-router-dom";

import ServiceExperience from "./ServiceExperience.jsx";
import ServiceDetail from "./ServiceDetail.jsx";
import { serviceExperienceBySlug } from "../data/serviceExperiences";

/**
 * /services/:slug resolves to one of two pages.
 *
 * Section 03's eight capabilities get the chapter experience; the five older
 * slugs Section 02 links to (erp-solutions, high-performing-websites, …) keep
 * the original ServiceDetail page. The two slug sets do not overlap, so this is
 * an unambiguous lookup rather than a guess — and Section 02's links keep
 * working untouched.
 *
 * A slug in neither set falls through to ServiceDetail, which already renders a
 * 404 for one.
 */
export default function ServiceRoute() {
  const { slug } = useParams();
  return serviceExperienceBySlug[slug] ? <ServiceExperience /> : <ServiceDetail />;
}
