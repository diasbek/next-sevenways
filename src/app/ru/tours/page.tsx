import { createToursPage } from "@/i18n/create-pages";

const page = createToursPage("ru");
export const generateMetadata = page.generateMetadata;
export default page.Page;
