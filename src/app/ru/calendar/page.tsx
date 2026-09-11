import { createCalendarPage } from "@/i18n/create-pages";

const page = createCalendarPage("ru");
export const generateMetadata = page.generateMetadata;
export default page.Page;
