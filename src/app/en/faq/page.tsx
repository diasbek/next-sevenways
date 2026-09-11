import { createFaqPage } from "@/i18n/create-pages";

const page = createFaqPage("en");
export const generateMetadata = page.generateMetadata;
export default page.Page;
