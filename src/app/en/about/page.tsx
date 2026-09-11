import { createAboutPage } from "@/i18n/create-pages";

const page = createAboutPage("en");
export const generateMetadata = page.generateMetadata;
export default page.Page;
