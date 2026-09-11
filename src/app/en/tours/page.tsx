import { createToursPage } from "@/i18n/create-pages";

const page = createToursPage("en");
export const generateMetadata = page.generateMetadata;
export default page.Page;
