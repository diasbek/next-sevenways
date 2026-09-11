import { createCalendarPage } from "@/i18n/create-pages";

const page = createCalendarPage("en");
export const generateMetadata = page.generateMetadata;
export default page.Page;
