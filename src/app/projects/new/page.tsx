import { ProtectedLayout } from "@/components/layout/protected-layout";
import { ProjectForm } from "@/components/forms/project-form";

export default function NewProjectPage() {
  return (
    <ProtectedLayout>
      <div className="mx-auto max-w-2xl">
        <ProjectForm />
      </div>
    </ProtectedLayout>
  );
}
