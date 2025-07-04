import VisitorList from "@/components/app/VisitorList";

export default function AdminVisitorsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <VisitorList isAdmin={true} />
    </div>
  );
}
