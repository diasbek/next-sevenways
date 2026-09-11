import { createHomePage } from "@/i18n/create-pages";

const page = createHomePage("en");
export const generateMetadata = page.generateMetadata;
export default page.Page;
