import { createFaqPage } from "@/i18n/create-pages";

const page = createFaqPage("ru");
export const generateMetadata = page.generateMetadata;
export default page.Page;
