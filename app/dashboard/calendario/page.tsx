import { getCurrentCompany } from "@/lib/data/companies";
import { getCompanyPosts } from "@/lib/data/posts";
import { SmartCalendar } from "./SmartCalendar";

export default async function CalendarioPage() {
  const company = await getCurrentCompany();
  const posts = await getCompanyPosts(company.id);
  const calendarPosts = posts.filter((post) => {
    if (post.deleted_at || post.archived_at) return false;
    if (!post.scheduled_at) return false;

    return ["scheduled", "approved", "pending_approval"].includes(post.status);
  });

  return <SmartCalendar posts={calendarPosts} />;
}
